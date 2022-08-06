import { Deployment, DeploymentError } from "@vercel/client";
import { publishPRComment } from "./PRComment/publishPRComment";

export const publishDeploymentEvent = async (
  event?: Deployment,
  error?: DeploymentError
) => {
  await publishPRComment(event, error);
};
