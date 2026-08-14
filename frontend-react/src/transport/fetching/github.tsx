import axios from "axios";
import FrontendEnvVars from "@/context/env";
import type { GitHubUserShort, GitHubUserVerbose } from "../dtos/github";

const base_url = FrontendEnvVars.VITE_BACKEND_API_URL;

interface BackendGitHubUser {
  username: string;
  verbose: boolean;
  pfp_url: string;
  followers: BackendGitHubUser[] | null;
  followees: BackendGitHubUser[] | null;
}

function toShort(user: BackendGitHubUser): GitHubUserShort {
  return { kind: "short", username: user.username, pfp_url: user.pfp_url };
}

export async function GetGitHubUser(username: string): Promise<GitHubUserVerbose | undefined> {
  try {
    const response = await axios.get<BackendGitHubUser>(`${base_url}/api/github/users/${username}`);
    const user = response.data;
    return {
      kind: "verbose",
      username: user.username,
      pfp_url: user.pfp_url,
      followees: (user.followees ?? []).map(toShort),
      followers: (user.followers ?? []).map(toShort),
    };
  } catch (error) {
    console.error(`failed to fetch github user @${username} from backend server: ${error}`);
    return undefined;
  }
}
