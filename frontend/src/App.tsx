import { Outlet } from "react-router-dom";
import { WebHoundNav } from "./routing/nav";

function App() {
  const app = (
    <>
      <WebHoundNav />
      <Outlet />
    </>
  );

  return app;
}

export default App;
