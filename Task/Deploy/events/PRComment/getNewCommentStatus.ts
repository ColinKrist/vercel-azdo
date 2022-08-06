import { CommentThreadStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { Deployment, DeploymentError } from "@vercel/client";

export const getNewCommentStatus = (
  event?: Deployment,
  error?: DeploymentError
): CommentThreadStatus => {
  if (error) {
    return CommentThreadStatus.Active;
  }
  switch (event?.state) {
    case "READY":
      return CommentThreadStatus.Closed;
    case "INITIALIZING":
    case "ERROR":
      return CommentThreadStatus.Active;
    case "BUILDING":
    case "DEPLOYING":
      return CommentThreadStatus.Pending;
    default:
      return CommentThreadStatus.Active;
  }
};
