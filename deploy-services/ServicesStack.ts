import * as cdk from '@aws-cdk/core';
import Path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';

function createLambda(stack: cdk.Stack, name: string) {
  new lambda.Function(stack, name, {
    code: new lambda.AssetCode(
      Path.join(__dirname, '../services', name, 'dist')
    ),
    handler: 'app-lambda.handler',
    runtime: lambda.Runtime.NODEJS_12_X,
    environment: {},
    timeout: cdk.Duration.seconds(7),
    memorySize: 256,
  });
}

class MainStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);
    createLambda(this, 'flaky-api');
  }
}

(async function () {
  const app = new cdk.App();
  new MainStack(app, 'services');

  app.synth();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
