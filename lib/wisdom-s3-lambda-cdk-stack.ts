import { Duration, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as connect from 'aws-cdk-lib/aws-connect';
import * as cfn_migrate from 'aws-cdk-lib/cloudformation-include'

export class WisdomS3LambdaCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create S3 bucket to store data files.
    const wisdomBucket = new s3.Bucket(this, 'WisdomBucket', {
      versioned: true,    // Enable bucket versioning.
      bucketName: 'ad-wisdom-data-store-2'    // Bucket name.
     });

    // aws connect instance
    const cfnInstanceProps: connect.CfnInstanceProps = {
      attributes: {
        inboundCalls: true,
        outboundCalls: true,
        autoResolveBestVoices: true,
        contactflowLogs: true,
        contactLens: true,
        earlyMedia: true,
        useCustomTtsVoices: false,
      },
      identityManagementType: "CONNECT_MANAGED",
      instanceAlias: 'dev-wisdom-instance',
    };

    const connectInstance = new connect.CfnInstance(this, 'DevWisdomInstance', cfnInstanceProps);

    new CfnOutput(this, "InstanceServiceRole", {
      value: connectInstance.attrServiceRole,
      // exportName: `InstanceServiceRole-${appEnv}`,
      description: "Instance Service Role",
    });

    new CfnOutput(this, "InstanceArn", {
      value: connectInstance.attrArn,
      // exportName: `InstanceArn-${appEnv}`,
      description: "Instance Arn",
    });

    new cfn_migrate.CfnInclude(this, 'Template', {
      templateFile: 'connect-wisdom.yml',
      parameters: {
        "AmazonConnectInstanceARN": connectInstance.attrArn,
        "S3BucketName": "ad-connect-wisdow",
      }
    });
  }
}