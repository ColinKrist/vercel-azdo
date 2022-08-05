// Licensed under the MIT License.

import FileCommentData from "./FileCommentData";
import PullRequestCommentData from "./PullRequestCommentData";

/**
 * A wrapper grouping types of pull request comments.
 */
export default class CommentData {
  public pullRequestComments: PullRequestCommentData[] = [];
  public fileComments: FileCommentData[] = [];
}
