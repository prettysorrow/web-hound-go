import FrontendEnvVars from "@/context/env";
import { WebHoundTesting___Credentials } from "@/testing-data/credentials";
import type { Credentials } from "@/transport/dtos/credentials";

export function useCredentials(): Credentials[] {
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    return WebHoundTesting___Credentials;
  }

  throw new Error("not implemented: use credentials");
}
