import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useReducer } from "react";

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

function TelegramApiIdTextBox(
  setCreds: React.ActionDispatch<[action: CredentialsAction]>,
  api_id: string,
  api_hash: string,
) {
  return (
    <Input
      type="text"
      value={api_id}
      placeholder="Telegram API Id..."
      onChange={(e) =>
        setCreds({
          type: "set",
          service: "telegram",
          api_id: e.target.value,
          api_hash: api_hash,
        })
      }
    ></Input>
  );
}

function TelegramApiHashTextBox(
  setCreds: React.ActionDispatch<[action: CredentialsAction]>,
  api_id: string,
  api_hash: string,
) {
  return (
    <Input
      type="text"
      value={api_hash}
      placeholder="Telegram API Hash..."
      onChange={(e) =>
        setCreds({
          type: "set",
          service: "telegram",
          api_id: api_id,
          api_hash: e.target.value,
        })
      }
    ></Input>
  );
}

export function WebHoundCredentials() {
  let [creds, setCreds] = useReducer(reduce, InitCredentialsState);

  return (
    <Card>
      <FieldGroup>
        <Field>
          <FieldLabel>
            <Checkbox
              onCheckedChange={(checked) =>
                setCreds({ type: checked ? "init" : "unset", service: "telegram" })
              }
            />
            Telegram
          </FieldLabel>
          {creds.telegram !== undefined ? (
            <>
              {TelegramApiIdTextBox(setCreds, creds.telegram.api_id, creds.telegram.api_hash)}
              {TelegramApiHashTextBox(setCreds, creds.telegram.api_id, creds.telegram.api_hash)}
            </>
          ) : (
            <></>
          )}
        </Field>
        <Field>
          <FieldLabel>
            <Checkbox /> Instagram
          </FieldLabel>
          <Input type="text" placeholder="Instagram Login..."></Input>
          <Input type="text" placeholder="Instagram Password..."></Input>
        </Field>
      </FieldGroup>
    </Card>
  );
}
