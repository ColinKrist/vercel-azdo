import { Localizations } from "../../localization";
import { localizationFile, localizationPath } from "../../localization/index";
import CommentData from "../../models/PullRequests/CommentData";
import PullRequestCommentData from "../../models/PullRequests/PullRequestCommentData";

export const findVercelPRComment = (
  comments: CommentData
): PullRequestCommentData | null => {
  const loc = new Localizations(localizationPath, localizationFile);

  for (let index = 0; index < comments.pullRequestComments.length; index++) {
    const element = comments.pullRequestComments[index];

    if (
      element &&
      element?.content.startsWith(loc.getLocalization("comment.title"))
    ) {
      // matched comment header - update comment with new content
      return element;
    }
  }
  return null;
};
