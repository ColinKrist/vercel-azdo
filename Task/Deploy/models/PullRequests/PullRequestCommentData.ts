// Licensed under the MIT License.

import { CommentThreadStatus } from "azure-devops-node-api/interfaces/GitInterfaces";

/**
 * A class representing a pull request comment.
 */
export default class PullRequestCommentData {
  public id: number;
  public status: CommentThreadStatus;
  public content: string;

  /**
   * Initializes a new instance of the `PullRequestCommentData` class.
   * @param id The optional comment ID.
   * @param content The optional content (i.e., the text) associated with the comment.
   * @param status The optional status associated with the comment.
   */
  public constructor(
    id: number,
    content: string,
    status?: CommentThreadStatus
  ) {
    this.id = id;
    this.content = content;
    this.status = status ?? CommentThreadStatus.Unknown;
  }
}
