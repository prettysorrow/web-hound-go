import type { GitHubUserVerbose } from "@/transport/dtos/github";
import type { InstagramUserVerbose } from "@/transport/dtos/instagram";
import { create } from "zustand";
import { useWebHoundEnabledServices } from "@/settings/enabled-services/store";

export type WebHoundStore___Searching = {
  username: string | undefined;
  github: GitHubUserVerbose | "Not found" | "Disabled" | undefined;
  instagram: InstagramUserVerbose | "Not found" | "No credentials" | "Disabled" | undefined;
  setUsername(username: string): void;
  setGitHub(value: GitHubUserVerbose | "Not found" | "Disabled"): void;
  setInstagram(user: InstagramUserVerbose | "Not found" | "No credentials" | "Disabled"): void;
};

export const useWebHoundSearchingStore = create<WebHoundStore___Searching>((set) => {
  useWebHoundEnabledServices.subscribe((state, prev) => {
    if (state.enabled.github !== prev.enabled.github && !state.enabled.github) {
      set((state) => ({ ...state, github: "Disabled" }));
    }

    if (state.enabled.instagram !== prev.enabled.instagram && !state.enabled.instagram) {
      set((state) => ({ ...state, instagram: "Disabled" }));
    }
  });

  return {
    username: undefined,
    github: undefined,
    instagram: undefined,
    setUsername: (username) => set((state) => ({ ...state, username: username })),
    setGitHub: (value) => set((state) => ({ ...state, github: value })),
    setInstagram: (value) => set((state) => ({ ...state, instagram: value })),
  };
});
