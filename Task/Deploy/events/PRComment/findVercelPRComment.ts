import { Localizations } from "../../localization";
import CommentData from "../../models/PullRequests/CommentData";
import FileCommentData from "../../models/PullRequests/FileCommentData";
import { localizationFile, localizationPath } from "../../localization/index";

export const findVercelPRComment = (
  comments: CommentData
): FileCommentData | null => {
  const loc = new Localizations(localizationPath, localizationFile);

  for (let index = 0; index < comments.fileComments.length; index++) {
    const element = comments.fileComments[index];

    if (element?.content.startsWith(loc.getLocalization("comment.header"))) {
      // matched comment header - update comment with new content
      return element;
    }
  }
  return null;
};
