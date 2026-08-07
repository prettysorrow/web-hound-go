import { GithubIcon, GoogleIcon, TelegramIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ShowServiceName(service: "telegram" | "github" | "gmail") {
  switch (service) {
    case "telegram":
      return "Telegram";
    case "github":
      return "GitHub";
    case "gmail":
      return "Google Mail";
    default:
      let _: never = service;
      throw new Error("should not happen");
  }
}

export function ShowServiceIcon(props: { service: "telegram" | "gmail" | "github"; size: string }) {
  switch (props.service) {
    case "telegram":
      return <HugeiconsIcon icon={TelegramIcon} size={props.size} />;
    case "gmail":
      return <HugeiconsIcon icon={GoogleIcon} size={props.size} />;
    case "github":
      return <HugeiconsIcon icon={GithubIcon} size={props.size} />;
    default:
      let _: never = props.service;
      throw new Error("should not happen");
  }
}
