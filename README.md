# Appflow Patterns - a library to facilitate data flows

This library aims at simplifying the task of setting up data flows between SaaS like SharePoint and S3.

This library is  written using the wonderful [projen](https://github.com/projen/projen) framework.

Note: this library is just the result of some personal experimentation. It is not an official AWS library and is not supported by AWS!

# Installation

The library is available on npmjs.com and can be installed using:

`npm i dms-patterns`

And on pypi:

`pip install dms-patterns`

# Usage Examples

## Sharepoint to S3

This example creates a scheduled and ondemand flow from a sharepoint site to an s3 bucket.

```typescript
import { Sharepoint2S3Flow } from '../src/appflow-patterns/sharepoint2s3';


export class Sharepoint2S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: 'my-bucket',
    });

    new Sharepoint2S3Flow(this, 'Sharepoint2S3Flow', {
      site: 'sites/${siteName},${siteID},${webID}',
      entities: ['${site}/_api/v2.0/drive/root:/path/to/folder'],
      profileArn: 'arn:aws:appflow:us-east-1:123456789012:connector-profile/12345678-1234-1234-1234-123456789012',
      bucketName: bucket.bucketName,
      scheduleExpression: 'rate(12 hour)',
    });

  }
}
```

Currently, only carbon-based entities are supported due to a limitation of AWS Appflow.
