import axios from "axios";
import FrontendEnvVars from "@/context/env";
import type { InstagramUserShort, InstagramUserVerbose } from "../dtos/instagram";

const base_url = FrontendEnvVars.VITE_BACKEND_API_URL;

export function instagramAvatarUrl(username: string): string {
  return `${base_url}/api/instagram/avatars/${encodeURIComponent(username)}`;
}

interface BackendInstagramMedia {
  kind: "photo" | "video";
  url: string;
}

interface BackendInstagramPost {
  description: string;
  media: BackendInstagramMedia[];
}

interface BackendInstagramUser {
  id: number;
  kind: "public" | "private" | "short";
  username: string;
  pfp_url: string;
  followees?: BackendInstagramUser[];
  followers?: BackendInstagramUser[];
  posts?: BackendInstagramPost;
  status?: "in_progress" | "complete";
}

function toShort(user: BackendInstagramUser): InstagramUserShort {
  return { kind: "short", username: user.username, pfp_url: user.pfp_url };
}

export async function GetInstagramUser(
  username: string,
  followLimit?: number,
): Promise<InstagramUserVerbose | undefined> {
  try {
    const response = await axios.get<BackendInstagramUser>(
      `${base_url}/api/instagram/users/${username}`,
      {
        params:
          followLimit !== undefined && followLimit > 0 ? { follow_limit: followLimit } : undefined,
      },
    );
    const user = response.data;

    if (user.kind === "private") {
      return {
        kind: "private",
        username: user.username,
        pfp_url: user.pfp_url,
        status: user.status ?? "complete",
      };
    }

    return {
      kind: "public",
      username: user.username,
      pfp_url: user.pfp_url,
      followees: (user.followees ?? []).map(toShort),
      followers: (user.followers ?? []).map(toShort),
      posts: user.posts ?? { description: "", media: [] },
      status: user.status ?? "complete",
    };
  } catch (error) {
    console.error(`failed to fetch instagram user @${username} from backend server: ${error}`);
    return undefined;
  }
}
