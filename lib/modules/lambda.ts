import { Duration, Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import { createResourceName } from "./common";
import env from "./env";

export type CreatLambdaProps = {
  functionName: string;
  filePath: string;
  environment?: { [key: string]: string };
};

export function createLambda(stack: Stack, props: CreatLambdaProps) {
  const { functionName, filePath, environment } = props;
  const resorceFunctionName = createResourceName(functionName);
  const nodejsFunction = new lambdaNode.NodejsFunction(stack, functionName, {
    functionName: resorceFunctionName,
    entry: filePath,
    runtime: lambda.Runtime.NODEJS_14_X,
    environment: {
      NAME: resorceFunctionName,
      BASE_NAME: functionName,
      REGION: stack.region,
      STACL_STAGE: env.stackStage,
      STACK_NAME: env.stackName,
      ...environment,
    },
    tracing: lambda.Tracing.ACTIVE,
    timeout: Duration.minutes(15),
  });
  return nodejsFunction;
}
