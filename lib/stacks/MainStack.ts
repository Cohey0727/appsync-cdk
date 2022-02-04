import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import {
  createGrapqlApi,
  createLambdaAndResolversFromSchema,
} from "../modules";

const LAMBDA_RESOLVER_ROOT_DIR = "app/resolvers";
const GRAPHQL_SCHEMA_PATH = "app/schema.graphql";

export default class MainStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const graphqlApi = createGrapqlApi(this, {
      schemaPath: GRAPHQL_SCHEMA_PATH,
    });
    createLambdaAndResolversFromSchema(this, {
      graphqlApi,
      rootDir: LAMBDA_RESOLVER_ROOT_DIR,
      schemaPath: GRAPHQL_SCHEMA_PATH,
    });
  }
}
