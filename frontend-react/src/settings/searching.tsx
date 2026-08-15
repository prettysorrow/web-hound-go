import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { WebHoundEnabledServices } from "./enabled-services/panel";
import { useWebHoundInstagramFollowLimit } from "./instagram-follow-limit/store";

const INSTAGRAM_FOLLOW_LIMIT_MIN = 1;
const INSTAGRAM_FOLLOW_LIMIT_MAX = 10000;

export function WebHoundInstagramFollowLimitField() {
  const { limit, setLimit } = useWebHoundInstagramFollowLimit();

  return (
    <Field>
      <h1>Instagram Graph Size</h1>
      <FieldLabel>Max followees/followers per user</FieldLabel>
      <Input
        type="number"
        min={INSTAGRAM_FOLLOW_LIMIT_MIN}
        max={INSTAGRAM_FOLLOW_LIMIT_MAX}
        value={limit}
        placeholder="Max followees/followers per user..."
        onChange={(event) => {
          const parsed = Number(event.target.value);
          const next = Number.isNaN(parsed) ? limit : parsed;
          setLimit(Math.min(INSTAGRAM_FOLLOW_LIMIT_MAX, Math.max(INSTAGRAM_FOLLOW_LIMIT_MIN, next)));
        }}
      />
      <FieldDescription>
        Limits how many followees and followers are shown in the Instagram social graph for a new
        search.
      </FieldDescription>
    </Field>
  );
}

export function WebHoundSearchingSettings() {
  return (
    <div>
      <WebHoundEnabledServices />
      <WebHoundInstagramFollowLimitField />
    </div>
  );
}
