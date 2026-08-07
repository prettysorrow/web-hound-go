import { Card } from "@/components/ui/card";
import type { Credentials } from "@/transport/dtos/credentials";
import {
  DistributeVerticalCenterIcon,
  GameControllerIcon,
  InstagramIcon,
  TelegramIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCredentials } from "./store";
import { AddCredentials } from "./add";
import { Button } from "@/components/ui/button";
import { act } from "react";

function _SingleCredentials(props: { credentials: Credentials; isActive: boolean }) {
  let components: React.ReactNode[] = [];

  components = [
    ...components,
    <div key={props.credentials.title} className="font-semibold mb-2">
      {props.credentials.title}
    </div>,
  ];

  if (props.credentials.telegram !== undefined) {
    let { api_id, api_hash } = props.credentials.telegram;

    components = [
      ...components,
      <div key={api_id} className="flex flex-row gap-2">
        <HugeiconsIcon icon={TelegramIcon} />
        <>API id: {api_id}</>
      </div>,
      <div key={api_hash} className="flex flex-row gap-2">
        <HugeiconsIcon icon={TelegramIcon} />
        <>API hash: {api_hash}</>
      </div>,
    ];
  }

  if (props.credentials.instagram !== undefined) {
    let { login, password } = props.credentials.instagram;

    components = [
      ...components,
      <div key={login} className="flex flex-row gap-2">
        <HugeiconsIcon icon={InstagramIcon} />
        <>Login: {login}</>
      </div>,
      <div key={`${login}_${password}`} className="flex flex-row gap-2">
        <HugeiconsIcon icon={InstagramIcon} />
        <>Password: {password}</>
      </div>,
    ];
  }

  if (props.credentials.steam !== undefined) {
    let { web_api_key } = props.credentials.steam;

    components = [
      ...components,
      <div key={web_api_key} className="flex flex-row gap-2">
        <HugeiconsIcon icon={GameControllerIcon} />
        <>Web API Key: {web_api_key}</>
      </div>,
    ];
  }

  let creds = (
    <div className="text-sm bg-gray-100 p-4 rounded ">
      <div className="flex flex-col gap-2">{...components}</div>
    </div>
  );

  return (
    <div>
      {creds}
      <div className="flex flex-row gap-2">
        <Button variant={"outline"}>Choise</Button>
        <Button variant={"destructive"}>Delete</Button>
      </div>
    </div>
  );
}

function SingleCredentials(props: { credentials: Credentials }) {
  function TelegramCreds() {
    if (props.credentials.telegram !== undefined) {
      let { api_id, api_hash } = props.credentials.telegram;
      return (
        <div>
          <div className="flex flex-row gap-2 items-center">
            <HugeiconsIcon icon={TelegramIcon} />
            <>API id: {api_id}</>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <HugeiconsIcon icon={TelegramIcon} />
            <>API hash: {api_hash}</>
          </div>
        </div>
      );
    }

    return <></>;
  }

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
        <TelegramCreds />
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
