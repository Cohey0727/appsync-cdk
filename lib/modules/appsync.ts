import { Stack } from "aws-cdk-lib";
import * as fs from "fs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { createResourceName } from "../modules";

type CreateGrapqlApiProps = {
  schemaPath: string;
};

export function createGrapqlApi(stack: Stack, props: CreateGrapqlApiProps) {
  const { schemaPath } = props;
  const name = createResourceName("GraphQLApi");
  const cfnGraphQLApi = new appsync.CfnGraphQLApi(stack, "CfnGraphQLApi", {
    authenticationType: "API_KEY",
    name: name,
    tags: [{ key: "name", value: name }],
  });
  const schema = fs.readFileSync(schemaPath, "utf8");
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
