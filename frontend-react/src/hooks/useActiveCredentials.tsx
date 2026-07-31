import FrontendEnvVars from "@/context/env";
import { WebHoundTesting___ActiveCredentials } from "@/testing-data/active-credentials";
import type { Credentials } from "@/transport/dtos/credentials";

export function useActiveCredentials(): Credentials {
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    return WebHoundTesting___ActiveCredentials;
  }

  throw new Error("not implemented: use active credentials");
}
