import env from "./env";

function createStackName(name: string) {
  return `${env.stackName}${name}-${env.stackStage}`;
}

export default createStackName;
