import { useSearcher } from "@/hooks/useSearcher";
import { useWebHoundSearchingStore } from "./store";
import { useEffect } from "react";
import { useCredentials } from "@/settings/credentials/store";
import { useWebHoundEnabledServices } from "@/settings/enabled-services/store";

export function WithActualResults(props: { children: React.ReactNode }) {
  const searcher = useSearcher();
  const { activeCreds } = useCredentials();
  const { enabled } = useWebHoundEnabledServices();
  const { username, github, instagram, setGitHub, setInstagram, setSearchingFor } =
    useWebHoundSearchingStore();

  useEffect(() => {
    if (username === undefined) {
      // username is not defined yet, nothing to do
      return;
    }

    const target = username;
    // a search for this username is already in progress (e.g. a duplicate
    // StrictMode mount), so there is nothing new to do here
    if (useWebHoundSearchingStore.getState().searchingFor === target) {
      return;
    }

    setSearchingFor(target);
    setGitHub(undefined);
    setInstagram(undefined);

    async function search() {
      if (enabled.github) {
        const github = await searcher.searchGitHub(target);
        if (useWebHoundSearchingStore.getState().username === target) {
          if (github !== undefined) {
            setGitHub(github);
          } else {
            setGitHub("Not found");
          }
        }
      } else if (useWebHoundSearchingStore.getState().username === target) {
        setGitHub("Disabled");
      }

      if (enabled.instagram) {
        if (
          searcher.requiresInstagramCredentials &&
          (activeCreds === undefined || activeCreds.instagram === undefined)
        ) {
          if (useWebHoundSearchingStore.getState().username === target) {
            setInstagram("No credentials");
          }
        } else {
          const instagram = await searcher.searchInstagram(target, activeCreds?.instagram);
          if (useWebHoundSearchingStore.getState().username === target) {
            if (instagram !== undefined) {
              setInstagram(instagram);
            } else {
              setInstagram("Not found");
            }
          }
        }
      } else if (useWebHoundSearchingStore.getState().username === target) {
        setInstagram("Disabled");
      }

      if (useWebHoundSearchingStore.getState().searchingFor === target) {
        setSearchingFor(undefined);
      }
    }

    search();
  }, [username]);

  if (username === undefined) {
    // username is not defined yet, nothing to do
    return <></>;
  }

  if (github === undefined || instagram === undefined) {
    return <div>Loading...</div>;
  }

  return props.children;
}
