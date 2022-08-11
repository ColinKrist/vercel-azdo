import { truncateStr } from './truncateStr';
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

export async function deploy(
  params: TaskParams,
  callback: (event?: Deployment, error?: DeploymentError) => Promise<void>
) {
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
        `[Vercel] - ${event.type} - ${truncateStr(JSON.stringify(event.payload), 250)}`
      );
    }

    // handle deployment events
    switch (event.type) {
      case "building": {
        const payload: Deployment = event.payload;
        await callback(payload);
        console.log(`[Vercel] - building - ${JSON.stringify(payload)}`);
        break;
      }
      case "created": {
        const payload: Deployment = event.payload;
        await callback(payload);
        console.log(
          `Deployment: ${event.type} -> ${payload.url} | setting shared variable 'deploymentUrl'`
        );
        setVariable("deploymentUrl", payload.url, false, true);
        break;
      }
      case "ready": {
        const payload: Deployment = event.payload;
        await callback(payload);
        break;
      }
      case "error": {
        const payload: DeploymentError = event.payload;
        await callback(undefined, payload);
        const message = `Vercel Error: ${payload.name} | ${payload.message} - code: ${payload.code}`;
        console.error(message);
        setResult(TaskResult.Failed, message);
        return;
      }
      case "canceled":
        // TODO - determine if callback event could be published
        console.error(`Deployment: ${event.type}`);
        setResult(TaskResult.Failed, "Build Canceled");
        return;
    }
  }

  return deployment;
}
