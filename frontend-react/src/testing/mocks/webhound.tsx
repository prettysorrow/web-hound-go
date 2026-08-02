import { http, HttpResponse } from "msw";
import { WebHoundTesting___WebHoundUsers } from "../inputs/webhound-users";
import { WebHoundTesting___WebHoundRequests } from "../inputs/webhound-requests";
import { WebHoundTesting___Credentials } from "../inputs/credentials";
import type { WebHoundUser } from "@/transport/dtos/webhound";

function findWebHoundUser(params: {
  used_service: "telegram" | "github" | "google";
  service_id: string;
}) {
  const satisfies = (user: WebHoundUser) =>
    user.used_service === params.used_service && user.service_id === params.service_id;

  const user = WebHoundTesting___WebHoundUsers.find(satisfies);

  if (user === undefined) {
    return new HttpResponse(
      { error: true, msg: "User not found" },
      { status: 404, statusText: "Not found" },
    );
  }

  return HttpResponse.json(user);
}

export const WebHoundTesting___BackendHandlers = [
  http.get("/api/users", () => HttpResponse.json(WebHoundTesting___WebHoundUsers)),

  http.get("/api/users/telegram/:username", (resolver: { params: { username: string } }) => {
    return findWebHoundUser({ used_service: "telegram", service_id: resolver.params.username });
  }),

  http.get("/api/requests", () => HttpResponse.json(WebHoundTesting___WebHoundRequests)),

  http.get("/api/credentials", () => HttpResponse.json(WebHoundTesting___Credentials)),
];
