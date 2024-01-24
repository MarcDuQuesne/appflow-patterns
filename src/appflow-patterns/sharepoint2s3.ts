import * as path from 'path';
import {
  DataPullMode,
  FlowStatus,
  Mapping,
  MicrosoftSharepointOnlineApiVersion,
  MicrosoftSharepointOnlineConnectorProfile,
  MicrosoftSharepointOnlineSource,
  MicrosoftSharepointOnlineTokenUrlBuilder,
  OnDemandFlow,
  OnScheduleFlow,
  S3Destination,
  S3OutputAggregationType,
} from '@cdklabs/cdk-appflow';

import { Duration, Fn, SecretValue } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { CfnRotationSchedule } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface Sharepoint2S3FlowProps {
  /*
   * The destination bucket name
   */
  readonly bucketName: string;
  /*
   * The destination bucket prefix. Note that the key of the object will contain the prefix and a unique run id (per flow run).
   * @default: 'raw'
   */
  readonly prefix?: string;
  /*
   * The name of the secret containing the credentials to connect to the sharepoint site.
   */
  readonly secretName: string;
  /*
   * The sharepoint site to connect to.
   * @example: 'sites/${siteName},${siteID},${webID}'
   */
  readonly site: string;
  /*
   * The list of entities to retrieve from the site
   * entities items id can be retrieved from the sharepoint site using this get request for a given path:
   * ${site}/_api/v2.0/drive/root:/path/to/folder
   */
  readonly entities: string[];
  /*
   * The schedule expression for the scheduled flow.
   * if not specified, a scheduled flow will not be created.
   * @example 'rate(1 day)'
   */
  readonly scheduleExpression?: string;
}

// Sharepoint2S3Flow is a L3 construct that creates a flow that retrieves data from a sharepoint site and stores it in an S3 bucket.
export class Sharepoint2S3Flow extends Construct {
  constructor(scope: Construct, id: string, props: Sharepoint2S3FlowProps) {
    super(scope, id);

    /*
     * As of November 2023, Amazon AppFlow natively supports only user-based identities
     * and works only with the Refresh Token Grant Flow for re-generating the access token.
     * It doesn't enable native service principal based token re-generation
     * (that relies on the Client Credentials Flow).
     *
     * This limitation is bypassed below by using a custom rotation lambda.
     *
     */
    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'secret', props.secretName);
    const tenantId: string = secret.secretValueFromJson('tenantId').unsafeUnwrap();
    const clientId: string = secret.secretValueFromJson('clientId').unsafeUnwrap();
    const clientSecret: string = secret.secretValueFromJson('clientSecret').unsafeUnwrap();

    const profile = new MicrosoftSharepointOnlineConnectorProfile(this, 'SFCC', {
      oAuth: {
        accessToken: secret.secretValueFromJson('accessToken'),
        flow: {
          refreshTokenGrant: {
            refreshToken: SecretValue.unsafePlainText(Fn.join('|', [clientId, clientSecret])),
          },
        },
        endpoints: {
          token: MicrosoftSharepointOnlineTokenUrlBuilder.buildTokenUrl(tenantId),
        },
      },
    });

    const rotationSchedule = profile.credentials!.addRotationSchedule('SharePointTokenRotation', {
      rotationLambda: new NodejsFunction(this, 'SFCCRotator', {
        entry: path.join(__dirname, 'rotation-lambda.ts'),
      }),
      rotateImmediatelyOnUpdate: true,
    });

    const schedule = Schedule.rate(Duration.hours(6));

    const cfnSchedule = rotationSchedule.node.defaultChild as CfnRotationSchedule;
    cfnSchedule.addPropertyOverride('RotationRules.ScheduleExpression', schedule.expressionString);
    cfnSchedule.addPropertyDeletionOverride('RotationRules.AutomaticallyAfterDays');

    const source = new MicrosoftSharepointOnlineSource({
      profile: profile,
      apiVersion: MicrosoftSharepointOnlineApiVersion.V1,
      object: {
        site: props.site,
        entities: props.entities,
      },
    });

    const destination = new S3Destination({
      location: {
        bucket: s3.Bucket.fromBucketName(this, 'bucket', props.bucketName),
        prefix: props.prefix || 'raw',
      },
      formatting: {
        aggregation: {
          type: S3OutputAggregationType.SINGLE_FILE, // required parameter
        },
      },
    });

    if (props.scheduleExpression) {
      new OnScheduleFlow(this, 'ScheduledFlow', {
        pullConfig: {
          mode: DataPullMode.INCREMENTAL,
        },
        schedule: Schedule.expression(props.scheduleExpression),
        source: source,
        destination: destination,
        mappings: [Mapping.map({ name: 'file' }, { name: 'file' })],
        status: FlowStatus.ACTIVE,
      });
    }

    new OnDemandFlow(this, 'OnDemandFlow', {
      source: source,
      destination: destination,
      mappings: [Mapping.map({ name: 'file' }, { name: 'file' })],
    });
  }
}

