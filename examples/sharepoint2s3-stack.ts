import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { Construct } from 'constructs';
import { Sharepoint2S3Flow } from '../src/appflow-patterns/sharepoint2s3';


export class Sharepoint2S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: 'my-bucket',
    });

    // this creates a scheduled and ondemand flow from a sharepoint site to an s3 bucket
    new Sharepoint2S3Flow(this, 'Sharepoint2S3Flow', {
      site: 'sites/${siteName},${siteID},${webID}',
      entities: ['${site}/_api/v2.0/drive/root:/path/to/folder'],
      secretName: 'my-secret',
      bucketName: bucket.bucketName,
      scheduleExpression: 'rate(12 hour)',
    });

  }
}
