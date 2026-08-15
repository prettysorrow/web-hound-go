import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WebHoundStore___InstagramFollowLimit {
  limit: number;
  setLimit(limit: number): void;
}

export const useWebHoundInstagramFollowLimit = create<WebHoundStore___InstagramFollowLimit>()(
  persist(
    (set) => ({
      limit: 100,
      setLimit: (limit) => set({ limit }),
    }),
    { name: "webhound-instagram-follow-limit", storage: createJSONStorage(() => localStorage) },
  ),
);
