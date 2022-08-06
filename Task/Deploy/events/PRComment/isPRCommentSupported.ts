/**
 * Determines whether the task is running against a supported pull request provider.
 * @returns `true` if the task is running against a supported pull request provider, or the name of the pull request provider otherwise.
 */
export function isSupportedProvider(): boolean {
  console.debug("* PRComment.isSupportedProvider");

  // If the action is running on Azure DevOps, check the provider.
  const variable: string | undefined = process.env["BUILD_REPOSITORY_PROVIDER"];

  if (variable === "TfsGit") {
    return true;
  }
  return false;
}
