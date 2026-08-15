import type { GitHubUserVerbose } from "@/transport/dtos/github";
import type { InstagramUserVerbose } from "@/transport/dtos/instagram";

export interface Searcher {
  get isLoading(): boolean;
  requiresInstagramCredentials: boolean;
  searchGitHub(username: string): Promise<GitHubUserVerbose | undefined>;
  searchInstagram(
    username: string,
    credentials?: { login: string; password: string },
    followLimit?: number,
  ): Promise<InstagramUserVerbose | undefined>;
}
