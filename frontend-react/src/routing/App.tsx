import { WebHoundAdminPanel } from "@/admin/panel";
import { WebHoundSettingsDropdownMenu } from "@/settings/settings";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <nav style={{ display: "flex", justifyContent: "center", gap: "1%" }}>
        <Link to="/about">About</Link>
        <WebHoundSettingsDropdownMenu />
        <WebHoundAdminPanel />
      </nav>
      <Outlet />
    </>
  );
}

export default App;
