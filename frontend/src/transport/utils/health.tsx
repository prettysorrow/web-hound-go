import FrontendEnvVars from "@/context/env";
import axios from "axios";

const base_url = FrontendEnvVars.VITE_BACKEND_API_URL;

export async function GetBackendHealth(): Promise<{ kind: "ok" } | { kind: "err"; msg: string }> {
  try {
    const response = await axios.get(`${base_url}/api/health`);
    if (response.status != 200) {
      return { kind: "err", msg: response.statusText };
    }

    return { kind: "ok" };
  } catch (error) {
    console.error(`failed to connect to backend server: ${error}`);
    return { kind: "err", msg: `${error}` };
  }
}
