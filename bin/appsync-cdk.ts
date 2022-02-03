#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MainStack } from "../lib/stacks";
import { createStackName } from "../lib/modules/common";

const app = new cdk.App();
const stackName = createStackName("AppSyncSample");
new MainStack(app, stackName, {});
