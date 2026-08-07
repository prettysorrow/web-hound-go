import App from "../App";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { WebHoundCredentials } from "@/settings/credentials/show";
import { WebHoundIndex } from "@/index";
import { WebHoundSearch } from "@/searching/search";
import { WebHoundProfile } from "@/settings/profile";
import { WebHoundRequestsMenu, WebHoundStatisticsMenu, WebHoundUsersMenu } from "@/admin/layouts";
import { WebHoundEnabledServices } from "@/settings/enabled-services/panel";
import { GitHubSocialGraph, InstagramSocialGraph } from "@/graph/convert";
import { WithActualResults } from "@/searching/with-actual-results";
import { WebHoundSocialGraphs } from "@/graph/social-graphs";

const WebHoundRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <WebHoundIndex />,
      },
      {
        path: "search",
        element: <WebHoundSocialGraphs />,
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
          {
            path: "searching",
            element: <WebHoundEnabledServices />,
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
