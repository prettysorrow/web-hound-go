import type { GitHubUser, GitHubUserShort, GitHubUserVerbose } from "@/transport/dtos/github";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// representation of results for github

export function GitHubUserShort(props: { username: string; pfp_url: string }) {
  return (
    <div className="flex gap-2">
      <Avatar size="sm">
        <AvatarImage src={props.pfp_url} />
      </Avatar>
      <span className="text-sm">{props.username}</span>
    </div>
  );
}

export function ScrollableGithubShortUsers(props: { users: GitHubUser[] }) {
  return (
    <div className="max-h-48 overflow-y-scroll">
      {props.users.map((user) => GitHubUserShort(user))}
    </div>
  );
}

export function GitHubUserVerbose(props: {
  kind: "verbose";
  username: string;
  pfp_url: string;
  followees: GitHubUser[];
  followers: GitHubUser[];
}) {
  return (
    <Card>
      <CardHeader>
        <Avatar>
          <AvatarImage src={props.pfp_url} />
        </Avatar>
        <span className="text-lg">{props.username}</span>
      </CardHeader>
      <CardContent>
        <h5>Followees</h5>
        <ScrollableGithubShortUsers users={props.followees} />
        <h5>Followers</h5>
        <ScrollableGithubShortUsers users={props.followers} />
      </CardContent>
    </Card>
  );
}
