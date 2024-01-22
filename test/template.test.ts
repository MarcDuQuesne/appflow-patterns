
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Sharepoint2S3Stack } from '../examples/sharepoint2s3-stack';

const app = new cdk.App();
const sharepoint2s3 = new Sharepoint2S3Stack(app, 'Mysql2S3Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },

});


test('sharepoint2s3 contains an flow ', () => {
  const template = Template.fromStack(sharepoint2s3);
  expect(template.resourceCountIs('AWS::AppFlow::Flow', 2));
});