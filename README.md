# DMS Patterns - a library to facilitate migrations

This library aims at simplifying the task of setting up a migration project using AWS DMS and the AWS CDK, by providing L2 constructs that take care of creating the necessary roles and resources and high-level L3 constructs that represent migration patterns from a database (in the cloud or a DB in AWS RDS) to AWS s3. See the example section below for more details.

This library is  written using the wonderful [projen](https://github.com/projen/projen) framework.

Note: this library is just the result of some personal experimentation. It is not an official AWS library and is not supported by AWS!

# Installation

The library is available on npmjs.com and can be installed using:

`npm i appflow-patterns`

And on pypi:

`pip install appflow-patterns`

# Usage Examples

## Migrating data from MySQL to S3

This section demonstrates creating a stack that migrates data from a MySQL database to S3. The stack is created in TypeScript, but the same constructs are available in Python.
We start by adding a source endpoint to our stack:

```typescript
this.source = new MySqlEndpoint(this, 'SourceEndpoint', {
  endpointType: EndpointType.SOURCE,
  databaseName: *******,
  endpointIdentifier: 'mysqlEndpoint',
  mySqlSourceEndpointSettings: {
    secretsManagerSecretId: 'arn:aws:secretsmanager:**********',
 },
});
```

A MySqlEndpoint is just a [dms.CfnEndpoint](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html), but the construct also takes care of initializing a secretsManagerAccessRole used by DMS to read the specified secret, that contains the necessary connection details:

```json
{
  "password":"*****",
  "username":"*****",
  "port":3306,
  "host":"****"
}
```

Our target is :

```typescript
this.target = new S3TargetEndpoint(this, 'S3Target', {
  bucketArn: props.bucketArn,
});
```

the construct takes again care of creating the necessary role for creating objects within the given bucket.

We can now define the replication itself. In case no default (subnet) vpc exists in your account, you may want to create a replicationSubnetGroup that describes where your resources will be deployed:

```typescript
const replicationSubnetGroup = new dms.CfnReplicationSubnetGroup(this, 'ReplicationSubnetGroup', {
  replicationSubnetGroupDescription: 'ReplicationSubnetGroup',
  replicationSubnetGroupIdentifier: 'mysqlreplicationsubnetID',
  subnetIds: [
    'subnet-******',
    'subnet-******',
    'subnet-******',
  ],
});
```
and, finally, a computeConfig:

```typescript
const computeConfig: dms.CfnReplicationConfig.ComputeConfigProperty = {
  minCapacityUnits: CapacityUnits._1,
  maxCapacityUnits: CapacityUnits._2,
  multiAz: false,
  replicationSubnetGroupId: replicationSubnetGroup.replicationSubnetGroupIdentifier,
  vpcSecurityGroupIds: [
    replicationSecurityGroup.securityGroupId,
  ],
};
```
and some rules for e.g. selecting the right tables:

```typescript
    const tableMappings = new TableMappings(
      [
        new SelectionRule(
          {
            objectLocator: {
              schemaName: 'schemaname',
              tableName: 'tableName',
            },
            ruleAction: SelectionAction.INCLUDE,
          },
        ),
      ],
    );
```

The tableMappings object takes care of assigning the rules a name and id if not specified and comes with a format method, see below.
Finally, we can write the replication in itself:

```typescript
new dms.CfnReplicationConfig(this, 'ReplicationConfig', {
  computeConfig: computeConfig,
  replicationConfigIdentifier: 'replicationConfigIdentifier',
  replicationType: ReplicationTypes.FULL_LOAD,
  sourceEndpointArn: this.source.ref,
  tableMappings: tableMappings.format(),
  targetEndpointArn: this.target.ref,
});

```
In the example above the 'experiment' table of the database specified above will be migrated to S3, and after executing the migration, a file 'LOAD00000001' is created in the specified 'folder' in the S3 bucket.

So far I demonstrated a couple of L2 constructs for the endpoints; but an L3 construct is also available that in turn takes care of creating all the endpoints and the migration itself:

```typescript
const mySql2S3 = new MySql2S3(this, 'mysql2S3', {
  databaseName: ******,
  mySqlSourceEndpointSettings: {
    secretsManagerSecretId: 'arn:aws:secretsmanager:*******',
  },
  bucketArn: bucketArn,
  tableMappings: tableMappings,
  computeConfig: computeConfig,
  replicationConfigIdentifier: '*****',
});
```

which makes migrations easier. A similar pattern exists for postgres, and more could be added in future versions.
