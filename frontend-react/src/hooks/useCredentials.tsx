import FrontendEnvVars from "@/context/env";
import { WebHoundTesting___ActiveCredentials } from "@/testing/inputs/credentials/active";
import { WebHoundTesting___Credentials } from "@/testing/inputs/credentials/all";
import type { Credentials } from "@/transport/dtos/credentials";
import { createContext, useContext, useReducer, useState } from "react";

type Action = { type: "add"; creds: Credentials } | { type: "delete"; creds: Credentials };

function reduce(state: Credentials[], action: Action): Credentials[] {
  if (action.type === "add") {
    return [...state, action.creds];
  }
  if (action.type === "delete") {
    return state.filter((creds) => creds !== action.creds);
  }

  throw new Error("should not happen");
}

type CredentialContextType = {
  creds: Credentials[];
  setCreds: React.ActionDispatch<[action: Action]>;
};

const CredentialsContext = createContext<CredentialContextType | undefined>(undefined);

export function WithCredentials(props: { children: React.ReactNode }) {
  let initCreds: Credentials[];
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    initCreds = WebHoundTesting___Credentials;
  } else {
    throw new Error("not implemented: credentials context");
  }

  let [creds, setCreds] = useReducer(reduce, initCreds);
  return (
    <CredentialsContext.Provider value={{ creds, setCreds }}>
      {props.children}
    </CredentialsContext.Provider>
  );
}

export function useCredentials(): {
  creds: Credentials[];
  setCreds: React.ActionDispatch<[action: Action]>;
} {
  let context = useContext(CredentialsContext);
  if (context === undefined) {
    throw new Error("failed to use credetials context");
  }

  return context;
}
