import { getInput } from "azure-pipelines-task-lib/task";
import { TaskParams } from "../models/TaskParams";

const getInputLogged = (name: string, required: boolean): string | undefined => {
  const value = getInput(name, required);
  console.log(`${name}: ${value}`);
  return value;
}

export function getParams(): TaskParams {
  const params: TaskParams = {
    token: "",
    path: "",
  };

  params.token = getInputLogged("token", true) ?? "";
  params.path = getInputLogged("path", true) ?? "";

  params.apiUrl = getInputLogged("apiUrl", false);
  params.debug = getInputLogged("debug", false) === "true";
  params.force = getInputLogged("force", false) === "true";
  params.isDirectory = getInputLogged("isDirectory", false) === "true";
  params.prebuilt = getInputLogged("prebuilt", false) === "true";
  params.rootDirectory = getInputLogged("rootDirectory", false);
  params.skipAutoDetectionConfirmation =
    getInputLogged("skipAutoDetectionConfirmation", false) === "true";
  params.teamId = getInputLogged("teamId", false);
  params.userAgent = getInputLogged("userAgent", false);
  params.withCache = getInputLogged("withCache", false) === "true";

  // custom params
  params.projectId == getInputLogged("projectId", false);

  return params;
}
