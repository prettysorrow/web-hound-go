import FrontendEnvVars from "@/context/env";
import { WebHoundTesting___WebHoundRequests } from "@/testing-data/webhound-requests";
import type { WebHoundRequest } from "@/transport/dtos/webhound";

export function useWebHoundRequests(): WebHoundRequest[] {
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    return WebHoundTesting___WebHoundRequests;
  }

  throw new Error("not implemented: use webhound requests");
}
