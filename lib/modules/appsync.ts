import { Stack } from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { createStackName } from "../modules";
import * as fs from "fs";

export function createGrapqlApi(scope: Stack) {
  const name = createStackName("GraphQLApi");
  const cfnGraphQLApi = new appsync.CfnGraphQLApi(scope, "CfnGraphQLApi", {
    authenticationType: "API_KEY",
    name: name,
    tags: [{ key: "name", value: name }],
  });
  const schema = fs.readFileSync("app/schema.graphql", "utf8");

  const cfnGraphQLSchema = new appsync.CfnGraphQLSchema(
    scope,
    "CfnGraphQLSchema",
    {
      apiId: cfnGraphQLApi.attrApiId,
      definition: schema,
    }
  );
  return cfnGraphQLApi;
}
