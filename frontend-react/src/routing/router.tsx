import { createBrowserRouter } from "react-router-dom";
import { FirstPage, PageWithUI, SecondPage } from "./pages";
import App from "./App";

const WebHoundRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/first-page",
        element: <FirstPage />,
      },
      {
        path: "/second-page",
        element: <SecondPage />,
      },
      {
        path: "/page-with-ui",
        element: <PageWithUI />,
      },
    ],
  },
]);

export default WebHoundRouter;
