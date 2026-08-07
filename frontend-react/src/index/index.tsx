import { Button } from "@/components/ui/button";
import { GithubIcon, GoogleIcon, TelegramIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function WebHoundIndex() {
  return (
    <div
      className="grid grid-rows-2 justify-items-center"
      style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      <p className="text-5xl">Web Hound</p>
      <p className="text-lg">Search, Seek, Destroy.</p>
      <div className="flex">
        <HugeiconsIcon icon={GoogleIcon} size="40px" />
        <Button variant="ghost" className="text-[14px] w-auto h-auto px-2 py-3">
          Login
        </Button>
        <span className="w-8"></span>
        <HugeiconsIcon icon={TelegramIcon} size="40px" />
        <Button variant="ghost" className="text-[14px] w-auto h-auto px-2 py-3">
          Login
        </Button>
        <span className="w-8"></span>
        <HugeiconsIcon icon={GithubIcon} size="40px" />
        <Button variant="ghost" className="text-[14px] w-auto h-auto px-2 py-3">
          Login
        </Button>
      </div>
    </div>
  );
}
