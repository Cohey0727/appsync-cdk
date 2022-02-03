import { Stack } from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { createStackName } from "../modules";
import schemas from "../../app/schemas";

export function createGrapqlApi(scope: Stack) {
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
