import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SupportedServices = "github" | "instagram" | "steam";

export interface WebHoundStore___EnabledServices {
  enabled: {
    github: boolean;
    instagram: boolean;
    steam: boolean;
  };

  setService(service: SupportedServices, enabled: boolean): void;
  enableService(service: SupportedServices): void;
  disableService(service: SupportedServices): void;
}

function _setService(
  state: WebHoundStore___EnabledServices,
  service: SupportedServices,
  value: boolean,
) {
  switch (service) {
    case "instagram":
      return { ...state, enabled: { ...state.enabled, instagram: value } };
    case "steam":
      return { ...state, enabled: { ...state.enabled, steam: value } };
    case "github":
      return { ...state, enabled: { ...state.enabled, github: value } };
    default:
      let _: never = service;
      throw new Error("should not happen");
  }
}

export const useWebHoundEnabledServices = create<WebHoundStore___EnabledServices>()(
  persist(
    (set) => ({
      enabled: {
        github: false,
        instagram: false,
        steam: false,
      },

      setService: (service: SupportedServices, enabled: boolean) =>
        set((state) => _setService(state, service, enabled)),
      enableService: (service: SupportedServices) =>
        set((state) => _setService(state, service, true)),
      disableService: (service: SupportedServices) =>
        set((state) => _setService(state, service, false)),
    }),

    { name: "webhound-enabled-services", storage: createJSONStorage(() => localStorage) },
  ),
);
