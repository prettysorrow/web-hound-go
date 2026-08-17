import { WebHoundEnabledServices } from "./enabled-services/panel";
import { WebHoundGraphLimit } from "./limits/panel";

export function WebHoundSearchingSettings() {
  return (
    <div>
      <WebHoundEnabledServices />
      <WebHoundGraphLimit />
    </div>
  );
}
