import type { ReactNode } from "react";

// allows use webhound data fetching hooks
export function WebHoundFetchingProvider(props: { children: ReactNode }) {
  return props.children;
}
