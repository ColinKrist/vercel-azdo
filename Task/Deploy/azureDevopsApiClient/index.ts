// Licensed under the MIT License.

import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import * as azureDevOpsApi from "azure-devops-node-api";

export default class AzureDevOpsApiWrapper {
  /**
   * Gets a personal access token handler.
   * @param token The Azure DevOps API token.
   * @returns The personal access token handler.
   */
  public getPersonalAccessTokenHandler(token: string): IRequestHandler {
    return azureDevOpsApi.getPersonalAccessTokenHandler(token);
  }

  /**
   * Gets a web API instance on which the Azure DevOps operations can be invoked.
   * @param defaultUrl The default URL, which represents the base URL on which the operations are to be invoked.
   * @param authHandler The authentication handler instance.
   * @returns The web API instance.
   */
  public getWebApiInstance(
    defaultUrl: string,
    authHandler: IRequestHandler
  ): azureDevOpsApi.WebApi {
    return new azureDevOpsApi.WebApi(defaultUrl, authHandler);
  }
}