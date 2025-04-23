#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Lambda } from '../lib/lambda-stack';
import {S3Bucket} from "../lib/s3-stack";
const prodEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();
new Lambda(app, 'LambdaStack', { env: prodEnv });
new S3Bucket(app, 'S3BucketStack', { env: prodEnv });
app.synth();