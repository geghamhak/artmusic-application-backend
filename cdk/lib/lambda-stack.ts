import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  Architecture,
  DockerImageCode,
  DockerImageFunction,
} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs';
import path = require('path');
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { VpcStack } from './vpc-stack';
import { RdsStack } from './rds-stack';
import {
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';

export class Lambda extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new VpcStack(this, 'vpc');
    const rds = new RdsStack(this, 'rds', {
      vpc: vpc.vpc,
      securityGroup: vpc.securityGroup,
    });
    const lambdaRole = new Role(this, 'queryLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        ['secrets']: new PolicyDocument({
          statements: [
            new PolicyStatement({
              resources: [rds.database.secret?.secretFullArn || ''],
              actions: ['secretsmanager:GetSecretValue'],
            }),
          ],
        }),
      },
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole',
        ),
      ],
    });
    // Create a new lambda function
    const LambdaHandler = new DockerImageFunction(this, 'LambdaHandler', {
      timeout: cdk.Duration.seconds(30),
      functionName: 'LambdaHandler',
      vpc: vpc.vpc,
      code: DockerImageCode.fromImageAsset(
        path.join(__dirname, '../../app'),
      ),
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      architecture: Architecture.ARM_64,
      environment: {
        RDS_SECRET_NAME: rds.database.secret?.secretName || '',
      },
      role: lambdaRole,
      memorySize: 1024,
    });

    LambdaHandler.connections.allowToDefaultPort(rds.database);

    // Create a new Log Group and Log Stream for the Lambda function
    new logs.LogGroup(this, 'LambdaHandlerLogGroup', {
      logGroupName: `/aws/lambda/${LambdaHandler.functionName}`,
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Create a new api gateway
    const api = new RestApi(this, 'ApiRest', {
      restApiName: 'ApiRest',
      deploy: true,
      defaultMethodOptions: {
        apiKeyRequired: true,
      },
    });

    // add proxy resource to handle all api requests
    api.root.addProxy({
      defaultIntegration: new LambdaIntegration(LambdaHandler, {
        proxy: true,
      }),
    });
  }
}
