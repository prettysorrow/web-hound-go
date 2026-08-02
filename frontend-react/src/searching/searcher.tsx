import type { GitHubUserVerbose } from "@/transport/dtos/github";
import type { EnabledServicesType } from "./enabled-services";

export interface Searcher {
  get isLoading(): boolean;
  searchGitHub(username: string): GitHubUserVerbose | undefined;
}

export type SearcherState = {
  searcher: Searcher;
  setSearcher: React.Dispatch<React.SetStateAction<Searcher>>;
};

export interface SearcherConstructor {
  new (enabledServices: EnabledServicesType): Searcher;
}

export function makeSearcher(ctor: SearcherConstructor, enabledServices: EnabledServicesType) {
  return new ctor(enabledServices);
}
