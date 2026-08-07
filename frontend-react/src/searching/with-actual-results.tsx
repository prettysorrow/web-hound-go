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

    if (enabled.github) {
      const github = searcher.searchGitHub(username);
      if (github !== undefined) {
        setGitHub(github);
      } else {
        setGitHub("Not found");
      }
    } else {
      setGitHub("Disabled");
    }

    if (enabled.instagram) {
      if (activeCreds === undefined || activeCreds.instagram === undefined) {
        setInstagram("No credentials");
      } else {
        const instagram = searcher.searchInstagram(username, activeCreds.instagram);
        if (instagram !== undefined) {
          setInstagram(instagram);
        } else {
          setInstagram("Not found");
        }
      }
    } else {
      setInstagram("Disabled");
    }
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
