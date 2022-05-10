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

    const config = getProjectConfiguration(
      Array.isArray(params.path) ? params.path[0] : params.path,
      params.projectId
    );
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
      projectId:
        config && config.projectId ? config.projectId : params.projectId,
    });

    setResult(TaskResult.Succeeded, "Deployment succeeded.");
  } catch (err) {
    // @ts-ignore
    setResult(TaskResult.Failed, err.message);
  }
}

run();
