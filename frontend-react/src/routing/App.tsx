import { Outlet } from "react-router-dom";
import { WebHoundNav } from "./nav";

function App() {
  return (
    <>
      <WebHoundNav />
      <Outlet />
    </>
  );
}

export default App;
