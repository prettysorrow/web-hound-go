import App from "./App";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { WebHoundCredentials } from "@/settings/credentials";
import { WebHoundAbout } from "@/about/about";
import { WebHoundSearch } from "@/seeking/search";
import { WebHoundProfile } from "@/settings/profile";
import { WebHoundRequestsMenu, WebHoundStatisticsMenu, WebHoundUsersMenu } from "@/admin/layouts";

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
        path: "search",
        element: <WebHoundSearch />,
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
            path: "profile",
            element: <WebHoundProfile />,
          },
          {
            path: "credentials",
            element: <WebHoundCredentials />,
          },
        ],
      },
      {
        path: "admin",
        children: [
          {
            // redirect to root cuz admin does not have its own page
            index: true,
            element: <Navigate to="/" replace />,
          },
          {
            path: "users",
            element: <WebHoundUsersMenu />,
          },
          {
            path: "requests",
            element: <WebHoundRequestsMenu />,
          },
          {
            path: "statistics",
            element: <WebHoundStatisticsMenu />,
          },
        ],
      },
    ],
  },
]);

export default WebHoundRouter;
