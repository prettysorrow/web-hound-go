import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";

import { useWebHoundEnabledServices } from "./store";

export function WebHoundEnabledServices() {
  let enabled = useWebHoundEnabledServices();

  return (
    <Field>
      <h1>Enabled Services</h1>
      <div className="flex flex-col gap-1">
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            checked={enabled.enabled.github}
            onCheckedChange={(checked) => enabled.setService("github", checked)}
          />
          <span>GitHub</span>
        </label>
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            checked={enabled.enabled.telegram}
            onCheckedChange={(checked) => enabled.setService("telegram", checked)}
          />
          <span>Telegram</span>
        </label>
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            checked={enabled.enabled.instagram}
            onCheckedChange={(checked) => enabled.setService("instagram", checked)}
          />
          <span>Instagram</span>
        </label>
        <label className="flex flex-row gap-2 items-center">
          <Checkbox
            checked={enabled.enabled.steam}
            onCheckedChange={(checked) => enabled.setService("steam", checked)}
          />
          <span>Steam</span>
        </label>
      </div>
    </Field>
  );
}
