import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import React, { act, createContext, useContext, useReducer } from "react";
import { type Credentials } from "@/transport/dtos/credentials";
import { useCredentials } from "@/hooks/useCredentials";
import { useActiveCredentials } from "@/hooks/useActiveCredentials";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GameControllerIcon,
  GameIcon,
  InstagramIcon,
  TelegramIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const InitCredentialsState = {
  title: "",
  telegram: undefined,
  instagram: undefined,
  steam: undefined,
};

type CredentialsAction =
  | {
      type: "init";
      service: "telegram" | "instagram" | "steam";
    }
  | {
      type: "set";
      service: "telegram";
      api_id: string;
      api_hash: string;
    }
  | {
      type: "set";
      service: "instagram";
      login: string;
      password: string;
    }
  | {
      type: "set";
      service: "steam";
      web_api_key: string;
    }
  | {
      type: "unset";
      service: "telegram" | "instagram" | "steam";
    }
  | {
      type: "title";
      title: string;
    };

function reduce(state: Credentials, action: CredentialsAction): Credentials {
  if (action.type === "init" && action.service === "telegram") {
    return { ...state, telegram: { api_id: "", api_hash: "" } };
  }
  if (action.type === "init" && action.service === "instagram") {
    return { ...state, instagram: { login: "", password: "" } };
  }
  if (action.type === "init" && action.service === "steam") {
    return { ...state, steam: { web_api_key: "" } };
  }
  if (action.type === "set" && action.service === "telegram") {
    return { ...state, telegram: { api_id: action.api_id, api_hash: action.api_hash } };
  }
  if (action.type === "set" && action.service === "instagram") {
    return { ...state, instagram: { login: action.login, password: action.password } };
  }
  if (action.type === "set" && action.service === "steam") {
    return { ...state, steam: { web_api_key: action.web_api_key } };
  }
  if (action.type === "unset" && action.service === "telegram") {
    return { ...state, telegram: undefined };
  }
  if (action.type === "unset" && action.service === "instagram") {
    return { ...state, instagram: undefined };
  }
  if (action.type === "unset" && action.service === "steam") {
    return { ...state, steam: undefined };
  }
  if (action.type === "title") {
    return { ...state, title: action.title };
  }

  throw new Error("should not happen");
}

const CredsContext = createContext<
  { creds: Credentials; setCreds: React.ActionDispatch<[action: CredentialsAction]> } | undefined
>(undefined);

function AddCredsProvider(props: { children: React.ReactNode }) {
  const [creds, setCreds] = useReducer(reduce, InitCredentialsState);
  const value = { creds, setCreds };

  return <CredsContext.Provider value={value}>{props.children}</CredsContext.Provider>;
}

function useNewCreds() {
  let context = useContext(CredsContext);
  if (context === undefined) {
    throw new Error("failed to use credentials context");
  }

  return context;
}

function TelegramApiIdInput(props: { api_id: string; api_hash: string }) {
  let { creds, setCreds } = useNewCreds();

  return (
    <Input
      type="text"
      value={props.api_id}
      placeholder="Telegram API Id..."
      onChange={(e) =>
        setCreds({
          type: "set",
          service: "telegram",
          api_id: e.target.value,
          api_hash: props.api_hash,
        })
      }
    ></Input>
  );
}

function TelegramApiHashInput(props: { api_id: string; api_hash: string }) {
  let { creds, setCreds } = useNewCreds();

  return (
    <Input
      type="text"
      value={props.api_hash}
      placeholder="Telegram API Hash..."
      onChange={(e) =>
        setCreds({
          type: "set",
          service: "telegram",
          api_id: props.api_id,
          api_hash: e.target.value,
        })
      }
    ></Input>
  );
}

function TelegramInputs() {
  let { creds, setCreds } = useNewCreds();
  if (creds.telegram !== undefined) {
    return (
      <>
        <TelegramApiIdInput api_id={creds.telegram.api_id} api_hash={creds.telegram.api_hash} />
        <TelegramApiHashInput api_id={creds.telegram.api_id} api_hash={creds.telegram.api_hash} />
      </>
    );
  }
  return <></>;
}

function InstagramLoginInput(props: { login: string; password: string }) {
  let { creds, setCreds } = useNewCreds();
  return (
    <Input
      type="text"
      value={props.login}
      placeholder="Enter Instagram login..."
      onChange={(e) =>
        setCreds({
          type: "set",
          service: "instagram",
          login: e.target.value,
          password: props.password,
        })
      }
    />
  );
}

function InstagramPasswordInput(props: { login: string; password: string }) {
  let { creds, setCreds } = useNewCreds();
  return (
    <Input
      type="text"
      value={props.password}
      placeholder="Enter Instagram password..."
      onChange={(e) =>
        setCreds({
          type: "set",
          service: "instagram",
          login: props.login,
          password: e.target.value,
        })
      }
    />
  );
}

function InstagramInputs() {
  let { creds, setCreds } = useNewCreds();
  if (creds.instagram === undefined) {
    return <></>;
  }

  return (
    <>
      <InstagramLoginInput login={creds.instagram.login} password={creds.instagram.password} />
      <InstagramPasswordInput login={creds.instagram.login} password={creds.instagram.password} />
    </>
  );
}

function ServiceCheckboxWithName(props: { service: "telegram" | "instagram" | "steam" }) {
  let { creds, setCreds } = useNewCreds();

  return (
    <FieldLabel>
      <div className="flex flex-rows align-center gap-2">
        <Checkbox
          onCheckedChange={(checked) =>
            setCreds({ type: checked ? "init" : "unset", service: props.service })
          }
        />
        <text>{props.service}</text>
      </div>
    </FieldLabel>
  );
}

function CredentialsTitleInput() {
  let { creds, setCreds } = useNewCreds();
  return (
    <Input
      type="text"
      value={creds.title}
      placeholder="Enter credentials title..."
      onChange={(e) => setCreds({ type: "title", title: e.target.value })}
    />
  );
}

function AddCredentials() {
  let setAllCreds = useCredentials().setCreds;
  let newCreds = useNewCreds().creds;
  return (
    <Card className="w-2/3 mx-auto p-4">
      <div className="text-lg">Add new credentials</div>
      <FieldGroup>
        <Field>
          <CredentialsTitleInput />
        </Field>
        <Field>
          <ServiceCheckboxWithName service="telegram" />
          <TelegramInputs />
        </Field>
        <Field>
          <ServiceCheckboxWithName service="instagram" />
          <InstagramInputs />
        </Field>
        <Field>
          <Button onClick={() => setAllCreds({ type: "add", creds: newCreds })}>Add</Button>
        </Field>
      </FieldGroup>
    </Card>
  );
}

function SingleCredentials(props: { credentials: Credentials }) {
  let components: React.ReactNode[] = [];

  components = [...components, <div className="font-semibold mb-2">{props.credentials.title}</div>];

  if (props.credentials.telegram !== undefined) {
    let { api_id, api_hash } = props.credentials.telegram;

    components = [
      ...components,
      <div className="flex flex-row gap-2">
        <HugeiconsIcon icon={TelegramIcon} />
        <>API id: {api_id}</>
      </div>,
      <div className="flex flex-row gap-2">
        <HugeiconsIcon icon={TelegramIcon} />
        <>API hash: {api_hash}</>
      </div>,
    ];
  }

  if (props.credentials.instagram !== undefined) {
    let { login, password } = props.credentials.instagram;

    components = [
      ...components,
      <div className="flex flex-row gap-2">
        <HugeiconsIcon icon={InstagramIcon} />
        <>Login: {login}</>
      </div>,
      <div className="flex flex-row gap-2">
        <HugeiconsIcon icon={InstagramIcon} />
        <>Password: {password}</>
      </div>,
    ];
  }

  if (props.credentials.steam !== undefined) {
    let { web_api_key } = props.credentials.steam;

    components = [
      ...components,
      <div className="flex flex-row gap-2">
        <HugeiconsIcon icon={GameControllerIcon} />
        <>Web API Key: {web_api_key}</>
      </div>,
    ];
  }

  return (
    <div className="text-sm bg-gray-100 p-4 rounded ">
      <div className="flex flex-col gap-2">{...components}</div>
    </div>
  );
}

function ActiveCredentials() {
  let credentials = useActiveCredentials();
  return (
    <Card className="w-2/3 mx-auto p-4">
      <div className="text-lg">Your active credentials:</div>
      <pre className="text-sm font-mono bg-gray-100 p-4 rounded overflow-auto">
        <SingleCredentials credentials={credentials} />
      </pre>
    </Card>
  );
}

function OtherCredentials() {
  let activeCreds = useActiveCredentials();
  let { creds } = useCredentials();
  let otherCreds = creds.filter((creds) => creds !== activeCreds);
  return (
    <Card className="w-2/3 mx-auto p-4">
      <div className="text-lg">Your other credentials:</div>
      <div className="flex flex-col gap-4">
        {otherCreds.map((creds) => (
          <pre className="text-sm font-mono bg-gray-100 p-4 rounded overflow-auto">
            <SingleCredentials credentials={creds} />
          </pre>
        ))}
      </div>
    </Card>
  );
}

export function WebHoundCredentials() {
  return (
    <div className="w-full pt-4 pb-10">
      <AddCredsProvider>
        <ActiveCredentials />
        <OtherCredentials />
        <AddCredentials />
      </AddCredsProvider>
    </div>
  );
}
