const { setResult, TaskResult } = require("azure-pipelines-task-lib/task");
console.log("after require");
import {
  getParams,
  validateParams,
  setFailedResults,
  deploy,
  getProjectConfiguration,
} from "./util";
console.log("after import");

async function run() {
  try {
    console.log("before getParams");
    const params = getParams();
    console.log(`params parsed: ${JSON.stringify(params)}`);

    let config;
    if (!params.projectId) {
      let path: string;
      if (Array.isArray(params.path)) {
        if (params.path.length > 1) {
          path = params.path[0] ?? "";
        } else {
          path = "";
        }
      } else {
        path = params.path;
      }

      config = getProjectConfiguration(path);
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
