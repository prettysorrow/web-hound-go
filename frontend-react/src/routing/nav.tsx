import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function WebHoundNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink>
            <Link to="/search">Search</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <li>
                <NavigationMenuLink>
                  <Link to="/settings/profile">Profile</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink>
                  <Link to="/settings/searching">Searching</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink>
                  <Link to="/settings/credentials">Credentials</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <NavigationMenuLink>
                <Link to="/admin/users">Users</Link>
              </NavigationMenuLink>
              <NavigationMenuLink>
                <Link to="/admin/requests">Requests</Link>
              </NavigationMenuLink>
              <NavigationMenuLink>
                <Link to="/admin/statistics">Statistics</Link>
              </NavigationMenuLink>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <Link to="/graph">Graph</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
