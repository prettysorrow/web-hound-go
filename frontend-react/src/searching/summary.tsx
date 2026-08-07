import { Button } from "@/components/ui/button";
import { InstagramResults } from "../entities/instagram";
import { GitHubResults } from "../entities/github";
import { useSearcher } from "@/hooks/useSearcher";
import { useWebHoundSearchingStore } from "./store";
import { useEffect } from "react";
import { useCredentials } from "@/settings/credentials/store";
import { useWebHoundEnabledServices } from "@/settings/enabled-services/store";

function WithActualResults(props: { children: React.ReactNode }) {
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

export function SearchingResults(props: {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function ResultsWindow(_props: { children: React.ReactNode }): React.ReactNode {
    return (
      <div className="bg-black/50 w-full h-full fixed top-0 left-0 flex justify-center items-center">
        <div className="bg-white w-1/3 p-5">
          <div className="flex justify-end">
            <Button onClick={() => props.setActive(false)}>Close</Button>
          </div>
          <div>{_props.children}</div>
        </div>
      </div>
    );
  }

  if (!props.active) {
    return <></>;
  }

  return (
    <WithActualResults>
      <ResultsWindow>
        <GitHubResults />
        <InstagramResults />
      </ResultsWindow>
    </WithActualResults>
  );
}
