const { setResult, TaskResult } = require("azure-pipelines-task-lib/task");
import {
  getParams,
  validateParams,
  setFailedResults,
  deploy,
  getProjectConfiguration,
} from "./util";

async function run() {
  try {
    const params = getParams();
    console.log(`params parsed: ${JSON.stringify(params)}`);

    let config;
    if(!params.projectId) {
      config = getProjectConfiguration(
        Array.isArray(params.path) ? params.path[0] : params.path
      );
    }

    if (config) {
      console.log(`configuration parsed: ${JSON.stringify(config)}`);
    }

    var validationResult = await validateParams(params);
    if (validationResult !== null) {
      setFailedResults(validationResult);
      return;
    }

    await deploy({
      ...params,
      projectId: params.projectId ?? config?.projectId,
    });

    setResult(TaskResult.Succeeded, "Deployment succeeded.");
  } catch (err) {
    console.error(err);
    // @ts-ignore
    setResult(TaskResult.Failed, err.stack);
  }
}

run();
