import { awscdk } from 'projen';

const cdkVersion = '2.122.0';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Matteo Giani',
  authorAddress: 'matteo.giani.87@gmail.com',
  cdkVersion: cdkVersion,
  defaultReleaseBranch: 'main',
  minNodeVersion: '18.16.1',
  jsiiVersion: '~5.0.0',
  name: 'appflow-patterns',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/MarcDuQuesne/appflow-patterns',
  deps: ['@cdklabs/cdk-appflow', '@aws-cdk/aws-glue-alpha', '@aws-cdk/aws-redshift-alpha'],
  publishToPypi: {
    distName: 'appflow-patterns',
    module: 'appflow_patterns',
  },
  description: 'L3-level cdk constructs for Appflow',
  devDeps: ['eslint-plugin-cdk', 'cdk-nag'],
  peerDeps: [],
  packageName: 'appflow-patterns',
});

project.eslint?.addPlugins('cdk');
project.eslint?.addRules({
  'cdk/construct-ctor': 'error',
  'cdk/construct-props-struct-name': 'error',
  // 'cdk/filename-match-regex': 'error',
  'cdk/public-static-property-all-caps': 'error',
  'cdk/no-static-import': 'error',
  'cdk/stack-props-struct-name': 'error',
  'cdk/prefer-type-only-imports': 'error',
});

project.synth();
