import "./styles/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import WebHoundRouter from "./routing/router";
import { WebHoundFetchingProvider } from "./hooks/WebHoundFetchingProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WebHoundFetchingProvider>
      <RouterProvider router={WebHoundRouter} />
    </WebHoundFetchingProvider>
  </StrictMode>,
);
