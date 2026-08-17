import type { Searcher } from "@/searching/searcher";
import { GetGitHubUser } from "@/transport/fetching/github";
import { GetInstagramUser } from "@/transport/fetching/instagram";
import type { GitHubUserVerbose } from "@/transport/dtos/github";
import type { InstagramUserVerbose } from "@/transport/dtos/instagram";
import { useWebHoundGraphLimit } from "@/settings/limits/store";

export class WebHoundBackend___Searcher implements Searcher {
  private _isLoading: boolean;

  constructor() {
    this._isLoading = false;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get requiresInstagramCredentials(): boolean {
    return false;
  }

  public async searchGitHub(username: string): Promise<GitHubUserVerbose | undefined> {
    return GetGitHubUser(username, useWebHoundGraphLimit.getState().limit);
  }

  public async searchInstagram(username: string): Promise<InstagramUserVerbose | undefined> {
    return GetInstagramUser(username, useWebHoundGraphLimit.getState().limit);
  }
}
