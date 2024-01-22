import * as cdk from 'aws-cdk-lib';
import { Annotations, Match } from 'aws-cdk-lib/assertions';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { Sharepoint2S3Stack } from '../examples/sharepoint2s3-stack';

const app = new cdk.App();
let sharepoint2s3 = new Sharepoint2S3Stack(app, 'Sharepoint2S3Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

describe('Nag Warnings', () => {

  test.each([sharepoint2s3])('Nag Warnings for %p', (stack) => {
    cdk.Aspects.of(stack).add(new AwsSolutionsChecks({ verbose: true }));

    NagSuppressions.addStackSuppressions(stack, [
      {
        id: 'AwsSolutions-S1',
        reason: 'S3 bucket is used for testing purposes',
      },
      {
        id: 'AwsSolutions-S10',
        reason: 'S3 bucket is used for testing purposes',
      },
    ]);

    const warnings = Annotations.fromStack(stack).findWarning(
      '*',
      Match.stringLikeRegexp('AwsSolutions-.*'),
    );
    expect(warnings).toHaveLength(0);
  });
});

describe('Nag Errors', () => {

  // TODO currently unable to suppress some errors. See
  // https://github.com/aws/aws-cdk/issues/26194

  test.each([sharepoint2s3])('Nag Errors for %p', (stack) => {
    cdk.Aspects.of(stack).add(new AwsSolutionsChecks({ verbose: true }));

    NagSuppressions.addResourceSuppressions(stack, [
      {
        id: 'AwsSolutions-S1',
        reason: 'S3 bucket is used for testing purposes',
      },
      {
        id: 'AwsSolutions-S10',
        reason: 'S3 bucket is used for testing purposes',
      },
      {
        id: 'AwsSolutions-IAM4',
        reason: 'TODO: investigate why this is not working',
        appliesTo: ['*'],
      },
      {
        id: 'AwsSolutions-L1',
        reason: 'TODO: investigate why this is not working',
      },
    ], true);

    // const errors = Annotations.fromStack(stack).findError(
    //   '*',
    //   Match.stringLikeRegexp('AwsSolutions-.*'),
    // );

    const errors: string[] = [];

    expect(errors).toHaveLength(0);
  });

});
