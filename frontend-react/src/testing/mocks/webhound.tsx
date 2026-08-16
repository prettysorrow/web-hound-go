import { http, HttpResponse } from "msw";
import { WebHoundTesting___WebHoundUsers } from "../inputs/webhound/users";
import { WebHoundTesting___WebHoundRequests } from "../inputs/webhound/requests";
import { WebHoundTesting___Credentials } from "../inputs/credentials/all";

export const WebHoundTesting___BackendHandlers = [
  http.get("/api/users", () => HttpResponse.json(WebHoundTesting___WebHoundUsers)),

  http.get("/api/requests", () => HttpResponse.json(WebHoundTesting___WebHoundRequests)),

  http.get("/api/credentials", () => HttpResponse.json(WebHoundTesting___Credentials)),
];
