import type { GraphData, PersonData } from "./dtos";
import { useWebHoundSearchingStore } from "@/searching/store";
import { WebHoundSocialGraph } from "./graph";

export function GitHubSocialGraph() {
  const { github, setUsername } = useWebHoundSearchingStore();

  if (github === undefined) {
    throw new Error("add WithActualResults before calling this shit");
  }

  if (github === "Disabled") {
    return <div>GitHub seaching is disabled</div>;
  }

  if (github === "Not found") {
    return <div>GitHub info not found</div>;
  }

  const followees: { person: PersonData; kind: "to" }[] = github.followees.map((followee) => ({
    person: {
      label: followee.username,
      image: followee.pfp_url,
      onClick: () => setUsername(followee.username),
    },
    kind: "to",
  }));

  const followers: { person: PersonData; kind: "by" }[] = github.followers.map((follower) => ({
    person: {
      label: follower.username,
      image: follower.pfp_url,
      onClick: () => setUsername(follower.username),
    },
    kind: "by",
  }));

  const graphData: GraphData = {
    main: { label: github.username, image: github.pfp_url },
    others: [...followees, ...followers],
  };

  return (
    <div>
      <label>GitHub social graph</label>
      <WebHoundSocialGraph {...graphData} />
    </div>
  );
}

export function InstagramSocialGraph() {
  const { instagram, setUsername } = useWebHoundSearchingStore();

  if (instagram === undefined) {
    throw new Error("add WithActualResults before calling this shit");
  }

  if (instagram === "Disabled") {
    return <div>Instagram seaching is disabled</div>;
  }

  if (instagram === "Not found") {
    return <div>Instagram info not found</div>;
  }

  if (instagram === "No credentials") {
    return <div>Instagram searching is not available due to credentials preferences</div>;
  }

  if (instagram.kind === "private") {
    return <div>Instagram profile is private, so social graph is not available</div>;
  }

  const followees: { person: PersonData; kind: "to" }[] = instagram.followees.map((followee) => ({
    person: {
      label: followee.username,
      image: followee.pfp_url,
      onClick: () => setUsername(followee.username),
    },
    kind: "to",
  }));

  const followers: { person: PersonData; kind: "by" }[] = instagram.followers.map((follower) => ({
    person: {
      label: follower.username,
      image: follower.pfp_url,
      onClick: () => setUsername(follower.username),
    },
    kind: "by",
  }));

  const graphData: GraphData = {
    main: { label: instagram.username, image: instagram.pfp_url },
    others: [...followees, ...followers],
  };

  return (
    <div>
      <label>Instagram social graph</label>
      <WebHoundSocialGraph {...graphData} />
    </div>
  );
}
