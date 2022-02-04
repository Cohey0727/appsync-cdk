import { Stack } from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { createResourceName } from "../modules";
import * as fs from "fs";

export function createGrapqlApi(stack: Stack) {
  const name = createResourceName("GraphQLApi");
  const cfnGraphQLApi = new appsync.CfnGraphQLApi(stack, "CfnGraphQLApi", {
    authenticationType: "API_KEY",
    name: name,
    tags: [{ key: "name", value: name }],
  });
  const schema = fs.readFileSync("app/schema.graphql", "utf8");

  const cfnGraphQLSchema = new appsync.CfnGraphQLSchema(
    stack,
    "CfnGraphQLSchema",
    {
      apiId: cfnGraphQLApi.attrApiId,
      definition: schema,
    }
  );
  return cfnGraphQLApi;
}
