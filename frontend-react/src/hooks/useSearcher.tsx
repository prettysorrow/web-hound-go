import FrontendEnvVars from "@/context/env";
import { EnabledServices, type EnabledServicesType } from "@/searching/enabled-services";
import { makeSearcher, type Searcher, type SearcherState } from "@/searching/searcher";
import { WebHoundTesting___Searcher } from "@/testing-data/searcher";
import React, { createContext, useContext } from "react";
import { useState } from "react";

const SearcherContext = createContext<SearcherState | undefined>(undefined);

export function WithSearcher(props: {
  children: React.ReactNode;
  enabledServices: EnabledServicesType;
}) {
  let initSearcher: Searcher;
  if (FrontendEnvVars.VITE_USE_TESTING_DATA) {
    initSearcher = makeSearcher(WebHoundTesting___Searcher, props.enabledServices);
  } else {
    throw new Error("not implemented: withsearcher");
  }

  const [searcher, setSearcher] = useState(initSearcher);

  return (
    <SearcherContext.Provider value={{ searcher, setSearcher }}>
      {props.children}
    </SearcherContext.Provider>
  );
}

export function useSearcher(): SearcherState {
  const context = useContext(SearcherContext);
  if (context === undefined) {
    throw new Error("invalid operation: useSearcher with no WithSeacher");
  }

  return context;
}
