import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useWebHoundGraphLimit } from "./store";

export function WebHoundGraphLimit() {
  const { limit, setLimit } = useWebHoundGraphLimit();

  return (
    <Field>
      <h1>Graph Limit</h1>
      <label className="flex flex-row gap-2 items-center">
        <span>Followers + followees to draw:</span>
        <Input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Math.max(0, Number(e.target.value)))}
        />
      </label>
    </Field>
  );
}
