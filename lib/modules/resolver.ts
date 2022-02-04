import { CreateLambdaResolverProps } from "./resolver";
import { createResourceName } from ".";
import { Stack } from "aws-cdk-lib";
import { buildSchema } from "graphql";
import * as fs from "fs";
import * as iam from "aws-cdk-lib/aws-iam";
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
  const role = createRole(stack);
  const dataSource = new appsync.CfnDataSource(stack, dataSourceName, {
    name: dataSourceName,
    apiId: graphqlApi.attrApiId,
    type: "AWS_LAMBDA",
    serviceRoleArn: role.roleArn,
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
    // Query: [],
    Mutation: Object.values(mutation?.getFields() || {}),
    // Mutation: [],
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

const roleSingletonStore: { value: null | iam.Role } = {
  value: null,
};

function createRole(stack: Stack) {
  if (roleSingletonStore.value) return roleSingletonStore.value;
  const role = new iam.Role(stack, "AppSyncExecutionRole", {
    roleName: createResourceName("AppSyncExecutionRole"),
    assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"),
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambda_FullAccess"),
    ],
  });

  const esPolicy = new iam.PolicyStatement();
  esPolicy.addAllResources();
  esPolicy.addActions("es:ESHttpPost", "es:ESHttpPut", "es:ESHttpDelete");
  role.addToPolicy(esPolicy);
  roleSingletonStore.value = role;
  return role;
}
