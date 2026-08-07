import type { Credentials } from "@/transport/dtos/credentials";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WebHoundStore___Credentials {
  allCreds: Credentials[];
  activeCreds: Credentials | undefined;
  setActiveCreds(creds: Credentials | undefined): void;
  addCreds(creds: Credentials): void;
  deleteCreds(creds: Credentials): void;
}

function _addCreds(
  state: WebHoundStore___Credentials,
  newCreds: Credentials,
): WebHoundStore___Credentials {
  // TODO: change localStorage here
  return { ...state, allCreds: [...state.allCreds, newCreds] };
}

function _deleteCreds(
  state: WebHoundStore___Credentials,
  deletingCreds: Credentials,
): WebHoundStore___Credentials {
  // TODO: change localStorage here
  const allCreds = state.allCreds.filter((creds) => creds.title !== deletingCreds.title);

  if (state.activeCreds !== undefined && state.activeCreds.title === deletingCreds.title) {
    return { ...state, allCreds, activeCreds: undefined };
  }

  return { ...state, allCreds };
}

export const useCredentials = create<WebHoundStore___Credentials>()(
  persist(
    (set) => ({
      allCreds: [],
      activeCreds: undefined,
      setActiveCreds: (creds) => set((state) => ({ ...state, activeCreds: creds })),
      addCreds: (newCreds) => set((state) => _addCreds(state, newCreds)),
      deleteCreds: (deletingCreds) => set((state) => _deleteCreds(state, deletingCreds)),
    }),
    {
      name: "webhound-credentials",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useActiveCredentials(): Credentials {
  let { activeCreds } = useCredentials();
  if (activeCreds === undefined) {
    throw new Error(
      "invalid operation: failed to use credentials: active credentials are not specified",
    );
  }

  return activeCreds;
}

export function useActiveInstagramCredentials(): { login: string; password: string } {
  let activeCreds = useActiveCredentials();
  if (activeCreds.instagram === undefined) {
    throw new Error(
      "invalid operation: failed to use credentials: instagram credentials are not specified in active credentials",
    );
  }
  return activeCreds.instagram;
}
