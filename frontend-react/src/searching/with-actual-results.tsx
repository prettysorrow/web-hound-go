import { useSearcher } from "@/hooks/useSearcher";
import { useWebHoundSearchingStore } from "./store";
import { useEffect } from "react";
import { useCredentials } from "@/settings/credentials/store";
import { useWebHoundEnabledServices } from "@/settings/enabled-services/store";
import { useWebHoundInstagramFollowLimit } from "@/settings/instagram-follow-limit/store";

const INSTAGRAM_POLL_INTERVAL_MS = 1200;
const INSTAGRAM_POLL_MAX_ATTEMPTS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function WithActualResults(props: { children: React.ReactNode }) {
  const searcher = useSearcher();
  const { activeCreds } = useCredentials();
  const { enabled } = useWebHoundEnabledServices();
  const { limit: instagramFollowLimit } = useWebHoundInstagramFollowLimit();
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

    async function searchInstagram() {
      if (
        searcher.requiresInstagramCredentials &&
        (activeCreds === undefined || activeCreds.instagram === undefined)
      ) {
        if (!cancelled) {
          setInstagram("No credentials");
        }
        return;
      }

      const creds = activeCreds?.instagram;
      let result = await searcher.searchInstagram(target, creds, instagramFollowLimit);
      if (!cancelled) {
        if (result !== undefined) {
          setInstagram(result);
        } else {
          setInstagram("Not found");
          return;
        }
      }

      let attempts = 0;
      while (!cancelled && result?.status === "in_progress" && attempts < INSTAGRAM_POLL_MAX_ATTEMPTS) {
        await sleep(INSTAGRAM_POLL_INTERVAL_MS);
        if (cancelled) {
          return;
        }
        result = await searcher.searchInstagram(target, creds, instagramFollowLimit);
        if (!cancelled && result !== undefined) {
          setInstagram(result);
        }
        attempts++;
      }
    }

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
        await searchInstagram();
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
