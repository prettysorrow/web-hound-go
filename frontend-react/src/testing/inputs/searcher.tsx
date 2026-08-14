import type { Searcher } from "@/searching/searcher";
import type { GitHubUserVerbose } from "@/transport/dtos/github";
import { WebHoundTesting___GitHubUsers } from "./github/users";
import type { InstagramUserVerbose } from "@/transport/dtos/instagram";
import { WebHoundTesting___InstagramUsers } from "./instagram/users";

export class WebHoundTesting___Searcher implements Searcher {
  private _isLoading: boolean;

  constructor() {
    this._isLoading = false;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get requiresInstagramCredentials(): boolean {
    return true;
  }

  public async searchGitHub(username: string): Promise<GitHubUserVerbose | undefined> {
    return WebHoundTesting___GitHubUsers.find((user) => user.username === username);
  }

  public async searchInstagram(username: string): Promise<InstagramUserVerbose | undefined> {
    return WebHoundTesting___InstagramUsers.find((user) => user.username === username);
  }
}
