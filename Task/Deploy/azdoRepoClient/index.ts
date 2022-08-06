import { WebApi } from "azure-devops-node-api";
import { IGitApi } from "azure-devops-node-api/GitApi";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import {
  Comment,
  CommentThreadStatus,
  GitPullRequestCommentThread,
} from "azure-devops-node-api/interfaces/GitInterfaces";
import AzureDevOpsApiWrapper from "../azureDevopsApiClient";
import { validateVariable } from "../envVariables/validator";
import CommentData from "../models/PullRequests/CommentData";
import FileCommentData from "../models/PullRequests/FileCommentData";
import PullRequestCommentData from "../models/PullRequests/PullRequestCommentData";

export class client {
  public azureDevOpsApiWrapper: AzureDevOpsApiWrapper =
    new AzureDevOpsApiWrapper();

  public project: string = "";
  public repositoryId: string = "";
  public pullRequestId: number = 0;
  public gitApi: IGitApi | undefined;

  /**
   * Gets all the comments for the pull request.
   * @returns Promise<CommentData>
   */
  public async getComments(): Promise<CommentData> {
    const gitApiPromise: IGitApi = await this.getGitApi();

    const threads: GitPullRequestCommentThread[] =
      await gitApiPromise.getThreads(
        this.repositoryId,
        this.pullRequestId,
        this.project
      );

    console.log(JSON.stringify(threads));

    return client.convertPullRequestComments(threads);
  }

  public async createComment(
    content: string,
    status: CommentThreadStatus
  ): Promise<void> {
    console.debug("* AzdoRepoClient.createComment()");

    const gitApi = await this.getGitApi();

    const commentThread: GitPullRequestCommentThread = {
      comments: [{ content }],
      status,
    };

    const result: GitPullRequestCommentThread = await gitApi.createThread(
      commentThread,
      this.repositoryId,
      this.pullRequestId,
      this.project
    );

    console.debug(JSON.stringify(result));
  }

  public async updateComment(
    commentThreadId: number,
    content: string | null,
    status: CommentThreadStatus | null
  ): Promise<void> {
    console.debug("* AzdoRepoClient.updateComment()");

    if (content === null && status === null) {
      return;
    }

    const gitApi = await this.getGitApi();
    if (content !== null) {
      const comment: Comment = {
        content,
      };

      const commentResult: Comment = await gitApi.updateComment(
        comment,
        this.repositoryId,
        this.pullRequestId,
        commentThreadId,
        1,
        this.project
      );

      console.debug(JSON.stringify(commentResult));
    }

    if (status !== null) {
      const commentThread: GitPullRequestCommentThread = {
        status,
      };

      const threadResult: GitPullRequestCommentThread =
        await gitApi.updateThread(
          commentThread,
          this.repositoryId,
          this.pullRequestId,
          commentThreadId,
          this.project
        );

      console.debug(JSON.stringify(threadResult));
    }
  }

  /**
   * Translate API data to our model.
   * @param threads
   * @returns
   */
  private static convertPullRequestComments(
    threads: GitPullRequestCommentThread[]
  ): CommentData {
    const result: CommentData = new CommentData();

    threads.forEach((thread: GitPullRequestCommentThread): void => {
      const id: number = thread.id ?? 0;
      const comments: Comment[] | undefined = thread.comments;
      if (comments === undefined) {
        return;
      }

      const initialThreadComment: string | undefined = comments[0]?.content;
      if (initialThreadComment === undefined || initialThreadComment === "") {
        return;
      }

      const threadStatus: CommentThreadStatus =
        thread.status ?? CommentThreadStatus.Unknown;

      if (thread.threadContext === null || thread.threadContext === undefined) {
        result.pullRequestComments.push(
          new PullRequestCommentData(id, initialThreadComment, threadStatus)
        );
      } else {
        const fileName: string | undefined = thread.threadContext.filePath;
        if (fileName === undefined || fileName.length <= 1) {
          return;
        }

        result.fileComments.push(
          new FileCommentData(
            id,
            initialThreadComment,
            fileName.substring(1),
            threadStatus
          )
        );
      }
    });

    return result;
  }

  /**
   * Configures the client to use the Azure DevOps API.
   * @returns Promise<IGitApi>
   */
  private async getGitApi(): Promise<IGitApi> {
    console.debug("* client.getGitApi()");

    if (this.gitApi !== undefined) {
      return this.gitApi;
    }

    this.initPRVars();

    const accessToken: string = validateVariable(
      "SYSTEM_ACCESS_TOKEN",
      "client.getGitApi()"
    );
    const authHandler: IRequestHandler =
      this.azureDevOpsApiWrapper.getPersonalAccessTokenHandler(accessToken);

    const defaultUrl: string = validateVariable(
      "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI",
      "client.getGitApi()"
    );
    const connection: WebApi = this.azureDevOpsApiWrapper.getWebApiInstance(
      defaultUrl,
      authHandler
    );
    this.gitApi = await connection.getGitApi();

    if (!this.gitApi) {
      throw new Error("Could not get GitApi");
    }

    return this.gitApi;
  }

  public initPRVars() {
    this.project = validateVariable("SYSTEM_TEAMPROJECT", "client.getGitApi()");

    this.repositoryId = validateVariable(
      "BUILD_REPOSITORY_ID",
      "client.getGitApi()"
    );

    this.pullRequestId = parseInt(
      validateVariable(
        "SYSTEM_PULLREQUEST_PULLREQUESTID",
        "pullRequestIdForAzurePipelines"
      ),
      10
    );
  }
}
