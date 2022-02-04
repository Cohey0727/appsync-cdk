import { Stack } from "aws-cdk-lib";
import { buildSchema } from "graphql";
import * as fs from "fs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { createLambda } from "./lambda";

export type CreateLambdaResolverProps = {
  graphqlApi: appsync.CfnGraphQLApi;
  lambdaFunction: lambda.Function;
  gqlTypeName: string;
  gqlFieldName: string;
};

export function createLambdaResolver(
  stack: Stack,
  props: CreateLambdaResolverProps
) {
  const { graphqlApi, lambdaFunction, gqlTypeName, gqlFieldName } = props;
  const dataSourceName = `${gqlTypeName}${gqlFieldName}LambdaDatasource`;
  const resolverName = `${gqlTypeName}${gqlFieldName}Resolver`;
  const dataSource = new appsync.CfnDataSource(stack, dataSourceName, {
    name: dataSourceName,
    apiId: graphqlApi.attrApiId,
    type: "AWS_LAMBDA",
    lambdaConfig: {
      lambdaFunctionArn: lambdaFunction.functionArn,
    },
  });

  const resolver = new appsync.CfnResolver(stack, resolverName, {
    apiId: graphqlApi.attrApiId,
    typeName: gqlTypeName,
    fieldName: gqlFieldName,
    dataSourceName: dataSource.name,
  });

  return resolver;
}

export type CreateLambdaAndResolversFromSchemaProps = {
  graphqlApi: appsync.CfnGraphQLApi;
  schemaPath: string;
  rootDir: string;
};

export function createLambdaAndResolversFromSchema(
  stack: Stack,
  props: CreateLambdaAndResolversFromSchemaProps
) {
  const { schemaPath, rootDir, graphqlApi } = props;
  const schemaFile = fs.readFileSync(schemaPath, "utf8");
  const schema = buildSchema(schemaFile);
  const query = schema.getQueryType();
  const mutation = schema.getMutationType();
  const subscription = schema.getSubscriptionType();

  const schemaFields = {
    Query: Object.values(query?.getFields() || {}),
    Mutation: Object.values(mutation?.getFields() || {}),
    Subscription: Object.values(subscription?.getFields() || {}),
  };

  Object.entries(schemaFields).forEach(([queryType, fields]) => {
    fields.forEach((field) => {
      const functionName = `Resolver-Query-${field.name}`;
      const fileDir = `${rootDir}/${queryType.toLocaleLowerCase()}`;
      const filePath = `${fileDir}/${field.name}.ts`;
      const lambdaFunction = createLambda(stack, { functionName, filePath });
      createLambdaResolver(stack, {
        gqlTypeName: queryType,
        gqlFieldName: field.name,
        lambdaFunction,
        graphqlApi,
      });
    });
  });
}
