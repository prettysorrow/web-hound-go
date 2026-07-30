import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import React, { createContext, useContext, useReducer } from "react";

interface CredentialsState {
  telegram: { api_id: string; api_hash: string } | undefined;
  instagram: { login: string; password: string } | undefined;
  steam: { web_api_key: string } | undefined;
}

const InitCredentialsState = { telegram: undefined, instagram: undefined, steam: undefined };

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
    };

function reduce(state: CredentialsState, action: CredentialsAction): CredentialsState {
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

  throw new Error("should not happen");
}

const CredsContext = createContext<
  | { creds: CredentialsState; setCreds: React.ActionDispatch<[action: CredentialsAction]> }
  | undefined
>(undefined);

function CredsProvider(props: { children: React.ReactNode }) {
  const [creds, setCreds] = useReducer(reduce, InitCredentialsState);
  const value = { creds, setCreds };

  return <CredsContext.Provider value={value}>{props.children}</CredsContext.Provider>;
}

function useCreds() {
  let context = useContext(CredsContext);
  if (context === undefined) {
    throw new Error("failed to use credentials context");
  }

  return context;
}

function TelegramApiIdInput(props: { api_id: string; api_hash: string }) {
  let { creds, setCreds } = useCreds();

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
  let { creds, setCreds } = useCreds();

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
  let { creds, setCreds } = useCreds();
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
  let { creds, setCreds } = useCreds();
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
  let { creds, setCreds } = useCreds();
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
  let { creds, setCreds } = useCreds();
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
  let { creds, setCreds } = useCreds();

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

export function WebHoundCredentials() {
  return (
    <CredsProvider>
      <Card className="w-full">
        <FieldGroup className="w-1/3 mx-auto">
          <Field>
            <ServiceCheckboxWithName service="telegram" />
            <TelegramInputs />
          </Field>
          <Field>
            <ServiceCheckboxWithName service="instagram" />
            <InstagramInputs />
          </Field>
        </FieldGroup>
      </Card>
    </CredsProvider>
  );
}
