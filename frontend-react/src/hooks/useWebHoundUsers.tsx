import FrontendEnvVars from "@/context/env";
import { WebHoundTesting___WebHoundUsers } from "@/testing-data/webhound-users";
import type { WebHoundUser } from "@/transport/dtos/webhound";

export function useWebHoundUsers(): WebHoundUser[] {
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    return WebHoundTesting___WebHoundUsers;
  }

  throw new Error("not implemented: fetching webhound users");
}
