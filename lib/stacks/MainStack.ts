import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { createStackName } from "../modules";
import schemas from "../../app/schemas";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export default class MainStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    createGrapqlApi(this);
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AppsyncCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}

function createGrapqlApi(scope: Stack) {
  const name = createStackName("GraphQLApi");
  const cfnGraphQLApi = new appsync.CfnGraphQLApi(scope, "CfnGraphQLApi", {
    authenticationType: "API_KEY",
    name: name,
    tags: [{ key: "name", value: name }],
  });
  const cfnGraphQLSchema = new appsync.CfnGraphQLSchema(
    scope,
    "CfnGraphQLSchema",
    {
      apiId: cfnGraphQLApi.attrApiId,
      definition: schemas,
    }
  );

  return cfnGraphQLApi;
}
