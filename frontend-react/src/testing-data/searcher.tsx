import type { Searcher } from "@/searching/searcher";
import type { GitHubUserVerbose } from "@/transport/dtos/github";
import { WebHoundTesting___GitHubUsers } from "./github-users";
import type { EnabledServicesType } from "@/searching/enabled-services";

export class WebHoundTesting___Searcher implements Searcher {
  private _enabledServices: EnabledServicesType;
  private _isLoading: boolean;

  constructor(enabledServices: EnabledServicesType) {
    this._isLoading = false;
    this._enabledServices = enabledServices;
    if (this._enabledServices.instagram) {
      throw new Error("not implemented: searcher for instagram");
    }
    if (this._enabledServices.steam) {
      throw new Error("not implemented: searcher for steam");
    }
    if (this._enabledServices.telegram) {
      throw new Error("not implemented: searcher for telegram");
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  public searchGitHub(username: string): GitHubUserVerbose | undefined {
    if (this._enabledServices.github) {
      return WebHoundTesting___GitHubUsers.find((user) => user.username === username);
    } else {
      throw new Error(
        "invalid operation: github seaching is not available for this instance of searcher",
      );
    }
  }
}
