import type { GitHubUser, GitHubUserShort } from "@/transport/dtos/github";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useWebHoundEnabledServices } from "@/settings/enabled-services/store";
import { useWebHoundSearchingStore } from "@/searching/store";
import { BoxWithUsernameRef } from "./box-with-username-ref";

function GitHubUserShort(props: { username: string; pfp_url: string }) {
  return (
    <BoxWithUsernameRef to={props.username}>
      <div className="flex flex-row gap-2 items-center">
        <img className="w-8 h-8 rounded-[50%]" src={props.pfp_url}></img>

        <span className="text-sm">{props.username}</span>
      </div>
    </BoxWithUsernameRef>
  );
}

function ScrollableGithubShortUsers(props: { users: GitHubUser[] }) {
  return (
    <div className="max-h-48 overflow-y-scroll flex flex-col gap-2">
      {props.users.map((user) => GitHubUserShort(user))}
    </div>
  );
}

export function GitHubResults() {
  const { github } = useWebHoundSearchingStore();

  if (github === "Disabled") {
    return <div>GitHub searching is disabled.</div>;
  }

  if (github === "Not found") {
    return <div>GitHub info not found</div>;
  }

  if (github === undefined) {
    throw new Error("add WithActualResults before calling this shit");
  }

  return (
    <label>
      <Card>
        <div className="flex flex-row justify-center font-medium text-lg">GitHub profile</div>
        <CardHeader>
          <label className="flex flex-row gap-4 items-center">
            <img className="rounded-[50%] w-18 h-18" src={github.pfp_url}></img>
            <span className="text-xl font-medium">{github.username}</span>
          </label>
        </CardHeader>
        <CardContent className="flex flex-row justify-around">
          <label>
            <div className="text-medium">Followees</div>
            <ScrollableGithubShortUsers users={github.followees} />
          </label>
          <label>
            <div className="text-medium">Followers</div>
            <ScrollableGithubShortUsers users={github.followers} />
          </label>
        </CardContent>
      </Card>
    </label>
  );
}
