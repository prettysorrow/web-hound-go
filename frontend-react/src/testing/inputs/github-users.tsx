import type { GitHubUserVerbose } from "@/transport/dtos/github";

export const WebHoundTesting___GitHubUsers: GitHubUserVerbose[] = [
  {
    kind: "verbose",
    username: "alice",
    pfp_url: "https://picsum.photos/500/500",
    followers: [
      { kind: "short", username: "bob", pfp_url: "https://picsum.photos/500/500" },
      { kind: "short", username: "charlie", pfp_url: "https://picsum.photos/500/500" },
      { kind: "short", username: "dart", pfp_url: "https://picsum.photos/500/500" },
    ],
    followees: [{ kind: "short", username: "charlie", pfp_url: "https://picsum.photos/500/500" }],
  },
  {
    kind: "verbose",
    username: "bob",
    pfp_url: "https://picsum.photos/500/500",
    followers: [],
    followees: [{ kind: "short", username: "alice", pfp_url: "https://picsum.photos/500/500" }],
  },
  {
    kind: "verbose",
    username: "charlie",
    pfp_url: "https://picsum.photos/500/500",
    followers: [{ kind: "short", username: "alice", pfp_url: "https://picsum.photos/500/500" }],
    followees: [
      { kind: "short", username: "alice", pfp_url: "https://picsum.photos/500/500" },
      { kind: "short", username: "dart", pfp_url: "https://picsum.photos/500/500" },
    ],
  },
  {
    kind: "verbose",
    username: "dart",
    pfp_url: "https://picsum.photos/500/500",
    followers: [{ kind: "short", username: "charlie", pfp_url: "https://picsum.photos/500/500" }],
    followees: [{ kind: "short", username: "alice", pfp_url: "https://picsum.photos/500/500" }],
  },
];
