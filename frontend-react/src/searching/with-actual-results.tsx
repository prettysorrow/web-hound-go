import { useSearcher } from "@/hooks/useSearcher";
import { useWebHoundSearchingStore } from "./store";
import { useEffect } from "react";
import { useCredentials } from "@/settings/credentials/store";
import { useWebHoundEnabledServices } from "@/settings/enabled-services/store";

export function WithActualResults(props: { children: React.ReactNode }) {
  const searcher = useSearcher();
  const { activeCreds } = useCredentials();
  const { enabled } = useWebHoundEnabledServices();
  const { username, github, instagram, setGitHub, setInstagram } = useWebHoundSearchingStore();

  useEffect(() => {
    if (username === undefined) {
      // username is not defined yet, nothing to do
      return;
    }

    const target = username;
    let cancelled = false;

    setGitHub(undefined);
    setInstagram(undefined);

    async function search() {
      if (enabled.github) {
        const github = await searcher.searchGitHub(target);
        if (!cancelled) {
          if (github !== undefined) {
            setGitHub(github);
          } else {
            setGitHub("Not found");
          }
        }
      } else if (!cancelled) {
        setGitHub("Disabled");
      }

      if (enabled.instagram) {
        if (
          searcher.requiresInstagramCredentials &&
          (activeCreds === undefined || activeCreds.instagram === undefined)
        ) {
          if (!cancelled) {
            setInstagram("No credentials");
          }
        } else {
          const instagram = await searcher.searchInstagram(target, activeCreds?.instagram);
          if (!cancelled) {
            if (instagram !== undefined) {
              setInstagram(instagram);
            } else {
              setInstagram("Not found");
            }
          }
        }
      } else if (!cancelled) {
        setInstagram("Disabled");
      }
    }

    search();

    return () => {
      cancelled = true;
    };
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
