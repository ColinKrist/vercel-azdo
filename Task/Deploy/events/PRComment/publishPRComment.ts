import { Deployment, DeploymentError } from "@vercel/client";
import { client } from "../../azdoRepoClient";
import { findVercelPRComment } from "./findVercelPRComment";
import { getNewCommentStatus } from "./getNewCommentStatus";
import { getPRCommentData, PullRequestCommentsData } from "./getPRCommentData";
import { isSupportedProvider } from "./isPRCommentSupported";

export const publishPRComment = async (
  event?: Deployment,
  error?: DeploymentError
) => {
  if (!isSupportedProvider()) {
    console.log("* PRComment.publishPRComment: not supported provider");
    return;
  }

  const azdoClient = new client();
  const comments = await azdoClient.getComments();

  const commentDTO: PullRequestCommentsData = {
    name: event?.name ?? "",
    status: event?.readyState ?? "",
    updatedAt: event?.buildingAt ?? event?.createdAt ?? -Infinity,
    //@ts-ignore - this isn't on the type but is on the json response
    inspectorUrl: event?.inspectorUrl ?? "",
    url: event?.url ?? "",
  };

  const newCommentData = getPRCommentData(commentDTO);

  const existingComment = findVercelPRComment(comments);
  if (existingComment) {
    await azdoClient.updateComment(
      existingComment.id,
      newCommentData,
      getNewCommentStatus(event, error)
    );
  } else {
    await azdoClient.createComment(
      newCommentData,
      getNewCommentStatus(event, error)
    );
  }
};
