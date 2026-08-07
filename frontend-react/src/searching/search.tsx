import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { WithSearcher } from "@/hooks/useSearcher";
import React, { use, useState } from "react";

import { SearchingResults } from "./summary";
import { useWebHoundSearchingStore } from "./store";

export function SearchCard(props: {
  setAreResultsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { username, setUsername } = useWebHoundSearchingStore();
  const [textboxState, setTextboxState] = useState(username || "");
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Input
          placeholder="Enter username..."
          value={textboxState}
          onChange={(e) => setTextboxState(e.target.value)}
        />
        <Button
          variant={"outline"}
          onClick={() => {
            props.setAreResultsActive(true);
            setUsername(textboxState);
          }}
        >
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
  let [areResultsActive, setAreResultsActive] = useState(false);

  return (
    <div>
      <div className="w-full min-h-screen flex items-center">
        <div className="w-1/3 mx-auto">
          <FieldGroup>
            <SearchCard setAreResultsActive={setAreResultsActive} />
          </FieldGroup>
        </div>
      </div>
      <SearchingResults active={areResultsActive} setActive={setAreResultsActive} />
    </div>
  );
}
