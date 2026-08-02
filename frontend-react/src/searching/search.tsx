import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSearcher, WithSearcher } from "@/hooks/useSearcher";
import React, { use, useState } from "react";
import {
  type EnabledServicesType,
  EnabledServices as WebHoundEnabledServices,
} from "./enabled-services";
import { GitHubUserVerbose } from "@/results/github";

export function EnabledServices(props: {
  enabled: EnabledServicesType;
  setEnabled: React.Dispatch<React.SetStateAction<EnabledServicesType>>;
}) {
  return (
    <Field>
      <h1>Enabled Services</h1>
      <div className="flex flex-col gap-1">
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            onCheckedChange={(checked) => props.setEnabled({ ...props.enabled, github: checked })}
          />
          <span>GitHub</span>
        </label>
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            onCheckedChange={(checked) => props.setEnabled({ ...props.enabled, telegram: checked })}
          />
          <span>Telegram</span>
        </label>
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            onCheckedChange={(checked) =>
              props.setEnabled({ ...props.enabled, instagram: checked })
            }
          />
          <span>Instagram</span>
        </label>
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            onCheckedChange={(checked) => props.setEnabled({ ...props.enabled, steam: checked })}
          />
          <span>Steam</span>
        </label>
      </div>
    </Field>
  );
}

export function SearchingResults(props: {
  username: string;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function ResultsWindow(_props: { children: React.ReactNode }): React.ReactNode {
    return (
      <div className="bg-black/50 w-full h-full fixed top-0 left-0 flex justify-center items-center">
        <div className="bg-white w-1/3 p-5">
          <div className="flex justify-end">
            <Button onClick={() => props.setActive(false)}>Close</Button>
          </div>
          <div>{_props.children}</div>
        </div>
      </div>
    );
  }

  let { searcher, setSearcher } = useSearcher();
  let result = searcher.searchGitHub(props.username);

  if (!props.active) {
    return <></>;
  }

  if (searcher.isLoading) {
    return <ResultsWindow>Loading...</ResultsWindow>;
  }

  if (result === undefined) {
    return <ResultsWindow>Not found.</ResultsWindow>;
  }

  return (
    <ResultsWindow>
      <div>GitHub Results:</div>
      <GitHubUserVerbose {...result} />
    </ResultsWindow>
  );
}

export function SearchCard(props: {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setAreResultsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Input
          placeholder="Enter username..."
          value={props.username}
          onChange={(e) => props.setUsername(e.target.value)}
        />
        <Button variant={"outline"} onClick={() => props.setAreResultsActive(true)}>
          Search
        </Button>
      </Field>
      <FieldDescription>
        Searching is performed using username used on different platforms
      </FieldDescription>
    </FieldGroup>
  );
}

export function WebHoundSearch() {
  let [enabledServices, setEnabledServices] = useState({
    github: false,
    telegram: false,
    instagram: false,
    steam: false,
  });
  let [username, setUsername] = useState("");
  let [areResultsActive, setAreResultsActive] = useState(false);

  return (
    <WithSearcher enabledServices={WebHoundEnabledServices}>
      <div className="w-full min-h-screen flex items-center">
        <div className="w-1/3 mx-auto">
          <FieldGroup>
            <SearchCard
              username={username}
              setUsername={setUsername}
              setAreResultsActive={setAreResultsActive}
            />
            <EnabledServices enabled={enabledServices} setEnabled={setEnabledServices} />
          </FieldGroup>
        </div>
      </div>
      <SearchingResults
        active={areResultsActive}
        setActive={setAreResultsActive}
        username={username}
      />
    </WithSearcher>
  );
}
