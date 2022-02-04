import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { createGrapqlApi, createLambda } from "../modules";

export default class MainStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    createGrapqlApi(this);
    createLambda(this, { functionName: "item", filePath: "item" });
  }
}
