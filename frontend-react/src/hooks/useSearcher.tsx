import FrontendEnvVars from "@/context/env";
import { type Searcher } from "@/searching/searcher";
import { WebHoundTesting___Searcher } from "@/testing/inputs/searcher";
import React, { createContext, useContext } from "react";
import { useState } from "react";

const SearcherContext = createContext<Searcher | undefined>(undefined);

export function WithSearcher(props: { children: React.ReactNode }) {
  let initSearcher: Searcher;
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    initSearcher = new WebHoundTesting___Searcher();
  } else {
    throw new Error("not implemented: withsearcher");
  }

  const [searcher, setSearcher] = useState(initSearcher);

  return <SearcherContext.Provider value={searcher}>{props.children}</SearcherContext.Provider>;
}

export function useSearcher(): Searcher {
  const context = useContext(SearcherContext);
  if (context === undefined) {
    throw new Error("invalid operation: useSearcher with no WithSeacher");
  }

  return context;
}
