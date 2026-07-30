export interface GitHubUserShort {
  kind: "short";
  username: string;
  pfp_url: string;
}

export interface GitHubUserVerbose {
  kind: "verbose";
  username: string;
  pfp_url: string;
  followees: GitHubUser[];
  followers: GitHubUser[];
}

export type GitHubUser = GitHubUserShort | GitHubUserVerbose;
