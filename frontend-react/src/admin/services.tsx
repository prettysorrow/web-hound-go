import { GithubIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ShowServiceName(service: "github" | "gmail") {
  switch (service) {
    case "github":
      return "GitHub";
    case "gmail":
      return "Google Mail";
    default:
      let _: never = service;
      throw new Error("should not happen");
  }
}

export function ShowServiceIcon(props: { service: "gmail" | "github"; size: string }) {
  switch (props.service) {
    case "gmail":
      return <HugeiconsIcon icon={GoogleIcon} size={props.size} />;
    case "github":
      return <HugeiconsIcon icon={GithubIcon} size={props.size} />;
    default:
      let _: never = props.service;
      throw new Error("should not happen");
  }
}
