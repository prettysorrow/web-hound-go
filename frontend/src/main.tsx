import "./styles/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import WebHoundRouter from "./routing/router";
import { WebHoundFetchingProvider } from "./hooks/WebHoundFetchingProvider";
import { WithCredentials } from "./hooks/useCredentials";
import { WithSearcher } from "./hooks/useSearcher";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WebHoundFetchingProvider>
      <WithCredentials>
        <WithSearcher>
          <RouterProvider router={WebHoundRouter} />
        </WithSearcher>
      </WithCredentials>
    </WebHoundFetchingProvider>
  </StrictMode>,
);
