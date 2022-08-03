import { readFileSync } from "fs";
import { setResult, TaskResult } from "azure-pipelines-task-lib";

import { ProjectConfiguration } from "../models/ProjectConfiguration";

export function getProjectConfiguration(
  path: string
): ProjectConfiguration | null {
  if (!path) {
    console.error("path is required");

    return null;
  }

  console.log(`Loading configuration from project: ${path}/.vercel/project.json`);

  try {
    const projectConfig: ProjectConfiguration = JSON.parse(
      readFileSync(`${path}/.vercel/project.json`, {
        encoding: "utf8",
      })
    );

    console.log(`Loaded configuration from project: ${path}/.vercel/project.json`);
    console.log(JSON.stringify(projectConfig, null, 2));

    return projectConfig;
  } catch (error) {
    console.error(error);
    setResult(
      TaskResult.Failed,
      `Project path: ${path}/.vercel/project.json is missing. Fix path or provide Project Id via task parameter`
    );
    return null;
  }
}
