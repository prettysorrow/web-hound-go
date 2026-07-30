import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { use, useState } from "react";

interface EnabledServices {
  github: boolean;
  telegram: boolean;
  instagram: boolean;
  steam: boolean;
}

export function EnabledServices(props: {
  enabled: EnabledServices;
  setEnabled: React.Dispatch<React.SetStateAction<EnabledServices>>;
}) {
  return (
    <Field>
      <h1>Enabled Services</h1>
      <div className="grid grid-cols-[auto_auto] gap-x-1 justify-start items-center">
        <Checkbox
          onCheckedChange={(checked) => props.setEnabled({ ...props.enabled, github: checked })}
        />
        GitHub
        <Checkbox
          onCheckedChange={(checked) => props.setEnabled({ ...props.enabled, telegram: checked })}
        />
        Telegram
        <Checkbox
          onCheckedChange={(checked) => props.setEnabled({ ...props.enabled, instagram: checked })}
        />
        Instagram
        <Checkbox
          onCheckedChange={(checked) => props.setEnabled({ ...props.enabled, steam: checked })}
        />
        Steam
      </div>
    </Field>
  );
}

export function SearchCard(props: { search(username: string): void }) {
  let [username, setUsername] = useState("");

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Input
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button variant={"outline"} onClick={() => props.search(username)}>
          Search
        </Button>
      </Field>
      <FieldDescription>
        Searching is performed via username used in different platforms
      </FieldDescription>
    </FieldGroup>
  );
}

function search(username: string) {
  console.log(`search ${username}`);
}

export function WebHoundSearch() {
  let [enabledServices, setEnabledServices] = useState({
    github: false,
    telegram: false,
    instagram: false,
    steam: false,
  });

  return (
    <div className="w-full">
      <div className="w-1/3 mx-auto">
        <FieldGroup>
          <SearchCard search={search} />
          <EnabledServices enabled={enabledServices} setEnabled={setEnabledServices} />
        </FieldGroup>
      </div>
    </div>
  );
}
