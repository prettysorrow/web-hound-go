import type { WebHoundDataToFetch } from "@/transport/dtos/webhound";
import { GetWebHoundUsers, GetWebHoundRequests } from "@/transport/fetching/webhound";
import { GetBackendHealth } from "@/transport/utils/health";
import { Children, createContext, useContext, type ReactNode } from "react";

const WebHoundDataToFetchContext = createContext<WebHoundDataToFetch | undefined>(undefined);

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

export function WebHoundFetchingProvider(props: { children: ReactNode }) {
  return <>{props.children}</>;
}

export function useWebHoundFetching(): WebHoundDataToFetch {
  return {
    users: [
      { used_service: "gmail", service_id: "1", display_name: "Alice" },
      { used_service: "telegram", service_id: "2", display_name: "Bob" },
    ],
    requests: [
      {
        created_at: "10:20",
        created_on: "Alice",
        created_by: { used_service: "telegram", service_id: "2", display_name: "Bob" },
        results: [{ service: "gmail", result: "alice@gmail.com" }],
      },
    ],
  };
}
