export interface InstagramUserShort {
  kind: "short";
  username: string;
  pfp_url: string;
}

export type InstagramUserVerbose =
  | {
      kind: "public";
      username: string;
      pfp_url: string;

      followees: InstagramUserShort[];
      followers: InstagramUserShort[];

      posts: {
        description: string;
        media: { kind: "photo" | "video"; url: string }[];
      };

      status?: "in_progress" | "complete";
    }
  | { kind: "private"; username: string; pfp_url: string; status?: "in_progress" | "complete" };

export type InstagramUser = InstagramUserVerbose | InstagramUserShort;
