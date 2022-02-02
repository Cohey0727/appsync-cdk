import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AppsyncCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AppsyncCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
