import App from "./App";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { WebHoundServices } from "@/settings/services";
import { WebHoundCredentials } from "@/settings/credentials";
import { WebHoundAbout } from "@/about/about";

const WebHoundRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "about",
        element: <WebHoundAbout />,
      },
      {
        path: "settings",
        children: [
          {
            // redirect to root cuz settings does not have its own page
            index: true,
            element: <Navigate to="/" replace />,
          },
          {
            path: "services",
            element: <WebHoundServices />,
          },
          {
            path: "credentials",
            element: <WebHoundCredentials />,
          },
        ],
      },
    ],
  },
]);

export default WebHoundRouter;
