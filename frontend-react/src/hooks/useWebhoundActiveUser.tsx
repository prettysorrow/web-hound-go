import type { WebHoundUser } from "@/transport/dtos/webhound";
import FrontendEnvVars from "@/context/env";
import { WebHoundTesting___ActiveUser } from "@/testing/inputs/webhound-active-user";

export function useWebhoundActiveUser(): WebHoundUser {
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    return WebHoundTesting___ActiveUser;
  }

  throw new Error("not implemented: fetching active user");
}
