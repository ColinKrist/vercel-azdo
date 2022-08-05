const {
  setResult,
  setVariable,
  TaskResult,
} = require("azure-pipelines-task-lib");
import {
  createDeployment,
  Deployment,
  DeploymentError,
  DeploymentOptions,
} from "@vercel/client";
import { TaskParams } from "../models/TaskParams";

export async function deploy(params: TaskParams) {
  let deployment;

  const clientOptions = {
    ...params,
  };

  const deployOptions: DeploymentOptions = {
    //@ts-ignore
    project: params.projectId,
  };

  console.log(
    `Deploying with createDeployment(clientOptions, deploymentOptions), clientOptions: ${JSON.stringify(
      clientOptions
    )} | deploymentOptions: ${JSON.stringify(deployOptions)}`
  );

  for await (const event of createDeployment(clientOptions, deployOptions)) {
    if (event.type != "hashes-calculated") {
      console.log(
        `[Vercel] - ${event.type} - ${JSON.stringify(event.payload)}`
      );
    }

    // handle deployment events
    switch (event.type) {
      case "created": {
        const payload: Deployment = event.payload;
        console.log(
          `Deployment: ${event.type} -> ${payload.url} | setting shared variable 'deploymentUrl'`
        );
        setVariable("deploymentUrl", payload.url, false, true);
        break;
      }
      case "ready":
        return;
      case "error": {
        const payload: DeploymentError = event.payload;
        const message = `Vercel Error: ${payload.name} | ${payload.message} - code: ${payload.code}`;
        console.error(message);
        setResult(TaskResult.Failed, message);
        return;
      }
      case "canceled":
        console.error(`Deployment: ${event.type}`);
        setResult(TaskResult.Failed, "Build Canceled");
        return;
    }
  }

  return deployment;
}
