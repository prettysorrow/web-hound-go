import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WebHoundStore___GraphLimit {
  limit: number;
  setLimit(limit: number): void;
}

export const useWebHoundGraphLimit = create<WebHoundStore___GraphLimit>()(
  persist(
    (set) => ({
      limit: 50,
      setLimit: (limit) => set((state) => ({ ...state, limit: limit })),
    }),

    { name: "webhound-graph-limit", storage: createJSONStorage(() => localStorage) },
  ),
);
