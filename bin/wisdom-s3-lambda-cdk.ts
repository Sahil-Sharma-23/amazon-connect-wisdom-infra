#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { WisdomS3LambdaCdkStack } from '../lib/wisdom-s3-lambda-cdk-stack';

const app = new cdk.App();
new WisdomS3LambdaCdkStack(app, 'WisdomS3LambdaCdkStack');
