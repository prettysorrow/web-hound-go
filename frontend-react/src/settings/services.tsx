import { Checkbox } from "@/components/ui/checkbox";

export function WebHoundServices() {
  return (
    <div>
      <h1>Enabled Services</h1>
      <div className="grid grid-cols-[auto_auto] justify-self-start gap-x-2">
        <Checkbox />
        GitHub
        <Checkbox />
        Telegram
        <Checkbox />
        Instagram
        <Checkbox />
        Steam
      </div>
    </div>
  );
}
