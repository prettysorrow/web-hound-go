import type { WebHoundDataToFetch } from "@/transport/dtos/webhound";
import { GetWebHoundUsers, GetWebHoundRequests } from "@/transport/fetching/webhound";
import { GetBackendHealth } from "@/transport/utils/health";
import { Children, createContext, useContext, type ReactNode } from "react";

// const WebHoundDataToFetchContext = createContext<WebHoundDataToFetch | undefined>(undefined);

// export async function WebHoundFetchingProvider(props: { children: ReactNode }) {
//   const health = await GetBackendHealth();
//   if (health.kind != "ok") {
//     throw new Error(`fetching failed, giving up: ${health.msg}`);
//   }

//   const users = await GetWebHoundUsers();
//   const requests = await GetWebHoundRequests();
//   return (
//     <WebHoundDataToFetchContext.Provider value={{ users, requests }}>
//       {props.children}
//     </WebHoundDataToFetchContext.Provider>
//   );
// }

// export function useWebHoundFetching(): WebHoundDataToFetch {
//   const context = useContext(WebHoundDataToFetchContext);
//   if (context === undefined) {
//     throw new Error("fetching context is undefined");
//   }
//   return context;
// }

import FrontendEnvVars from "@/context/env";
import { WebHoundTesting___WebHoundUsers } from "@/testing-data/webhound-users";
import { WebHoundTesting___WebHoundRequests } from "@/testing-data/webhound-requests";

export function WebHoundFetchingProvider(props: { children: ReactNode }) {
  return props.children;
}

export function useWebHoundFetching(): WebHoundDataToFetch {
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    return {
      users: WebHoundTesting___WebHoundUsers,
      requests: WebHoundTesting___WebHoundRequests,
    };
  }

  throw new Error("not implemented: fetching webhound users and requests");
}
