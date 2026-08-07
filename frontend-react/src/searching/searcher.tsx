import type { GitHubUserVerbose } from "@/transport/dtos/github";
import type { InstagramUserVerbose } from "@/transport/dtos/instagram";

export interface Searcher {
  get isLoading(): boolean;
  searchGitHub(username: string): GitHubUserVerbose | undefined;
  searchInstagram(
    username: string,
    credentials: { login: string; password: string },
  ): InstagramUserVerbose | undefined;
}
