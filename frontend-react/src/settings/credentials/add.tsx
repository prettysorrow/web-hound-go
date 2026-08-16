import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Credentials } from "@/transport/dtos/credentials";
import { createContext, useContext, useReducer } from "react";
import { useCredentials } from "./store";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const NewCredsInitState = {
  title: "",
  instagram: undefined,
  steam: undefined,
};

type NewCredsAction =
  | {
      type: "init";
      service: "instagram" | "steam";
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
      service: "instagram" | "steam";
    }
  | {
      type: "title";
      title: string;
    }
  | {
      type: "invalid";
      value: boolean;
    };

function reduceNewCreds(state: Credentials, action: NewCredsAction): Credentials {
  if (action.type === "init" && action.service === "instagram") {
    return { ...state, instagram: { login: "", password: "" } };
  }
  if (action.type === "init" && action.service === "steam") {
    return { ...state, steam: { web_api_key: "" } };
  }
  if (action.type === "set" && action.service === "instagram") {
    return { ...state, instagram: { login: action.login, password: action.password } };
  }
  if (action.type === "set" && action.service === "steam") {
    return { ...state, steam: { web_api_key: action.web_api_key } };
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

const NewCredsContext = createContext<
  { creds: Credentials; setCreds: React.ActionDispatch<[action: NewCredsAction]> } | undefined
>(undefined);

function WithNewCredsProvider(props: { children: React.ReactNode }) {
  const [creds, setCreds] = useReducer(reduceNewCreds, NewCredsInitState);
  const value = { creds, setCreds };
  return <NewCredsContext.Provider value={value}>{props.children}</NewCredsContext.Provider>;
}

function useNewCreds() {
  let context = useContext(NewCredsContext);
  if (context === undefined) {
    throw new Error("failed to use credentials context");
  }

  return context;
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

function ServiceCheckboxWithName(props: { service: "instagram" | "steam" }) {
  let { creds, setCreds } = useNewCreds();

  return (
    <div className="uppercase font-semibold">
      <label className="flex flex-row items-center gap-2">
        <Checkbox
          checked={creds[props.service] !== undefined}
          onCheckedChange={(checked) =>
            setCreds({ type: checked ? "init" : "unset", service: props.service })
          }
        />
        <span>{props.service}</span>
      </label>
    </div>
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

function isNewCredsValid(newCreds: Credentials, allCreds: Credentials[]): string | null {
  if (newCreds.title === "") {
    return "title is empty";
  }

  if (allCreds.some((existingCreds) => existingCreds.title === newCreds.title)) {
    return "title is already in use";
  }

  if (newCreds.instagram !== undefined) {
    if (newCreds.instagram.login === "") {
      return "instagram login is empty";
    }
    if (newCreds.instagram.password === "") {
      return "instagram password is empty";
    }
  }

  if (newCreds.steam !== undefined) {
    if (newCreds.steam.web_api_key === "") {
      return "steam web api key is empty";
    }
  }

  if (newCreds.instagram === undefined && newCreds.steam === undefined) {
    return "credentials are empty";
  }

  return null;
}

import { create } from "zustand";
import { all } from "axios";

type NewCredsAreInvalidState = {
  enable(err: string): void;
  disable(): void;
} & (
  | {
      valid: true;
      message: undefined;
    }
  | { valid: false; message: string }
);

const useNewCredsAreInvalidStore = create<NewCredsAreInvalidState>((set) => ({
  valid: true,
  message: undefined,
  enable: (err: string) => set((state) => ({ ...state, valid: false, message: err })),
  disable: () => set((state) => ({ ...state, valid: true, message: undefined })),
}));

function NewCredsAreInvalidWindow() {
  let { valid, disable, message } = useNewCredsAreInvalidStore();

  if (valid) {
    return <></>;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
      <div className="bg-white w-1/3 h-1/3 p-4 rounded">
        <div className="flex flex-row justify-end">
          <Button onClick={() => disable()}>X</Button>
        </div>
        <div className="h-full flex justify-center items-center">
          <div>
            <div className="text-lg">Data for new creds is invalid</div>
            <div>Error message: {message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCredentialsButton() {
  let { allCreds, addCreds } = useCredentials();
  let { creds, setCreds } = useNewCreds();
  let newCredsAreInvalidState = useNewCredsAreInvalidStore();

  function ClearInputs() {
    setCreds({ type: "unset", service: "instagram" });
    setCreds({ type: "unset", service: "steam" });
    setCreds({ type: "title", title: "" });
  }

  function onClick() {
    let err = isNewCredsValid(creds, allCreds);
    if (err) {
      newCredsAreInvalidState.enable(err);
    } else {
      addCreds(creds);
      ClearInputs();
    }
  }

  return <Button onClick={onClick}>Add</Button>;
}

export function AddCredentials() {
  return (
    <WithNewCredsProvider>
      <Card className="w-2/3 mx-auto p-4">
        <div className="text-lg">Add new credentials</div>
        <FieldGroup>
          <Field>
            <CredentialsTitleInput />
          </Field>
          <Field>
            <ServiceCheckboxWithName service="instagram" />
            <InstagramInputs />
          </Field>
          <Field>
            <AddCredentialsButton />
          </Field>
        </FieldGroup>
      </Card>
      <NewCredsAreInvalidWindow />
    </WithNewCredsProvider>
  );
}
