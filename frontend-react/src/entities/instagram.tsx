import type { InstagramUserShort } from "@/transport/dtos/instagram";
import { instagramAvatarUrl } from "@/transport/fetching/instagram";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWebHoundSearchingStore } from "@/searching/store";
import { BoxWithUsernameRef } from "./box-with-username-ref";

export function InstagramResults() {
  const { instagram } = useWebHoundSearchingStore();

  if (instagram === undefined) {
    throw new Error("add WithActualResults before calling this shit");
  }

  if (instagram === "Disabled") {
    return <div>Instagram searching is disabled.</div>;
  }

  if (instagram === "Not found") {
    return <div>Instagram info not found.</div>;
  }

  if (instagram === "No credentials") {
    return <div>Instagram info is not available due to credentials settings.</div>;
  }

  if (instagram.kind === "private") {
    return (
      <div>
        <div className="flex flex-row justify-center font-medium text-lg">
          Instagram profile is private
        </div>
        <label className="flex flex-row gap-4 items-center">
          <img className="rounded-[50%] w-18 h-18" src={instagramAvatarUrl(instagram.username)}></img>
          <span className="text-xl font-medium">{instagram.username}</span>
        </label>
      </div>
    );
  }

  function ShortUsersList(props: { users: InstagramUserShort[] }) {
    return (
      <div className="flex flex-col gap-2">
        {props.users.map((user) => (
          <BoxWithUsernameRef key={user.username} to={user.username}>
            <label className="flex flex-row gap-2 items-center">
              <img className="w-8 h-8 rounded-[50%]" src={instagramAvatarUrl(user.username)}></img>
              <span>{user.username}</span>
            </label>
          </BoxWithUsernameRef>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-center font-medium text-lg">Instagram profile</div>
        <label className="flex flex-row gap-4 items-center">
          <img className="rounded-[50%] w-18 h-18" src={instagramAvatarUrl(instagram.username)}></img>
          <span className="text-xl font-medium">{instagram.username}</span>
        </label>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-around">
          <div>
            <div>Followers:</div>
            <ShortUsersList users={instagram.followers} />
          </div>
          <div>
            <div>Followees:</div>
            <ShortUsersList users={instagram.followees} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
