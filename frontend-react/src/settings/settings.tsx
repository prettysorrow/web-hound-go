import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export function WebHoundSettingsDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem render={<Link to="/settings/services">Services</Link>} />
        <DropdownMenuItem render={<Link to="/settings/credentials">Credentials</Link>} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
