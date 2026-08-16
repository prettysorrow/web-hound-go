import { Card } from "@/components/ui/card";
import type { Credentials } from "@/transport/dtos/credentials";
import {
  DistributeVerticalCenterIcon,
  GameControllerIcon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCredentials } from "./store";
import { AddCredentials } from "./add";
import { Button } from "@/components/ui/button";

function SingleCredentials(props: { credentials: Credentials }) {
  function InstagramCreds() {
    if (props.credentials.instagram !== undefined) {
      let { login, password } = props.credentials.instagram;
      return (
        <div>
          <div className="flex flex-row gap-2 items-center">
            <HugeiconsIcon icon={InstagramIcon} />
            <>Login: {login}</>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <HugeiconsIcon icon={InstagramIcon} />
            <>Password: {password}</>
          </div>
        </div>
      );
    }

    return <></>;
  }

  function SteamCreds() {
    if (props.credentials.steam !== undefined) {
      let { web_api_key } = props.credentials.steam;

      return (
        <div className="flex flex-row gap-2">
          <HugeiconsIcon icon={GameControllerIcon} />
          <>Web API Key: {web_api_key}</>
        </div>
      );
    }

    return <></>;
  }

  let { activeCreds, setActiveCreds, deleteCreds } = useCredentials();

  function UnsetButton() {
    if (activeCreds === undefined || activeCreds.title !== props.credentials.title) {
      return <></>;
    }

    return (
      <Button variant={"outline"} onClick={() => setActiveCreds(undefined)}>
        Unset
      </Button>
    );
  }

  function ChoiseButton() {
    if (activeCreds !== undefined && activeCreds.title === props.credentials.title) {
      return <></>;
    }

    return (
      <Button variant={"outline"} onClick={() => setActiveCreds(props.credentials)}>
        Choise
      </Button>
    );
  }

  function DeleteButton() {
    return (
      <Button variant={"destructive"} onClick={() => deleteCreds(props.credentials)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="text-sm font-mono bg-gray-100 p-4 rounded">
      <div className="flex flex-col gap-2">
        <div className="font-semibold mb-2">{props.credentials.title}</div>
        <InstagramCreds />
        <SteamCreds />
        <div className="flex flex-row gap-2">
          <ChoiseButton />
          <UnsetButton />
          <DeleteButton />
        </div>
      </div>
    </div>
  );
}

function ActiveCredentials() {
  let { activeCreds } = useCredentials();
  if (activeCreds === undefined) {
    return (
      <Card className="w-2/3 mx-auto p-4">
        <div className="text-lg">No active credentials specified.</div>
      </Card>
    );
  }

  return (
    <Card className="w-2/3 mx-auto p-4">
      <div className="text-lg">Your active credentials:</div>
      <SingleCredentials credentials={activeCreds} />
    </Card>
  );
}

function OtherCredentials() {
  let { activeCreds, allCreds } = useCredentials();
  let otherCreds: Credentials[];

  if (activeCreds === undefined) {
    otherCreds = allCreds;
  } else {
    otherCreds = allCreds.filter((creds) => creds.title !== activeCreds.title);
  }

  if (otherCreds.length === 0) {
    return (
      <Card className="w-2/3 mx-auto p-4">
        <div className="text-lg">You have no other credentials.</div>
      </Card>
    );
  }

  return (
    <Card className="w-2/3 mx-auto p-4">
      <div className="text-lg">Your other credentials:</div>
      <div className="flex flex-col gap-4">
        {otherCreds.map((creds) => (
          <SingleCredentials key={creds.title} credentials={creds} />
        ))}
      </div>
    </Card>
  );
}

function ShowCredentials() {
  let { allCreds } = useCredentials();
  if (allCreds.length === 0) {
    return (
      <Card className="w-2/3 mx-auto p-4">
        <div className="text-lg">You have no credentials.</div>
      </Card>
    );
  }

  return (
    <div>
      <ActiveCredentials />
      <OtherCredentials />
    </div>
  );
}

export function WebHoundCredentials() {
  return (
    <div className="w-full pt-4 pb-10">
      <ShowCredentials />
      <AddCredentials />
    </div>
  );
}
