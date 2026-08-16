import axios from "axios";
import FrontendEnvVars from "@/context/env";
import type { InstagramUserShort, InstagramUserVerbose } from "../dtos/instagram";

const base_url = FrontendEnvVars.VITE_BACKEND_API_URL;

const avatar_url = (pfp_url: string) =>
  `${base_url}/api/instagram/avatars?url=${encodeURIComponent(pfp_url)}`;

interface BackendInstagramUser {
  id: number;
  kind: "public" | "private" | "short";
  username: string;
  pfp_url: string;
  followees?: BackendInstagramUser[];
  followers?: BackendInstagramUser[];
}

function toShort(user: BackendInstagramUser): InstagramUserShort {
  return { kind: "short", username: user.username, pfp_url: avatar_url(user.pfp_url) };
}

export async function GetInstagramUser(username: string, limit: number): Promise<InstagramUserVerbose | undefined> {
  try {
    const response = await axios.get<BackendInstagramUser>(
      `${base_url}/api/instagram/users/${username}?limit=${limit}`,
    );
    const user = response.data;

    if (user.kind === "private") {
      return { kind: "private", username: user.username, pfp_url: avatar_url(user.pfp_url) };
    }

    return {
      kind: "public",
      username: user.username,
      pfp_url: avatar_url(user.pfp_url),
      followees: (user.followees ?? []).map(toShort),
      followers: (user.followers ?? []).map(toShort),
    };
  } catch (error) {
    console.error(`failed to fetch instagram user @${username} from backend server: ${error}`);
    return undefined;
  }
}
