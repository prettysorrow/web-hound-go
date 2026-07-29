import { createBrowserRouter, Navigate } from "react-router-dom";
import { FirstPage, PageWithUI, SecondPage } from "./pages";
import App from "./App";
import { WebHoundServices } from "@/settings/services";
import { WebHoundCredentials } from "@/settings/credentials";

const WebHoundRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "first-page",
        element: <FirstPage />,
      },
      {
        path: "second-page",
        element: <SecondPage />,
      },
      {
        path: "page-with-ui",
        element: <PageWithUI />,
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
