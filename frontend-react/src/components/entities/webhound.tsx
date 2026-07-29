import type { WebHoundUser, WebHoundRequest } from "@/transport/dtos/webhound";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShowServiceName, ShowServiceIcon } from "@/admin/services";
import { ScrollArea } from "@/components/ui/scroll-area";

function WebHoundUser(props: { user: WebHoundUser }) {
  return (
    <Card className="flex p-4">
      <div className="flex gap-1 content-center">
        <Badge className="text-sm font-semibold" variant="outline">
          {props.user.used_service}
        </Badge>
        <ShowServiceIcon service={props.user.used_service} size="18px" />
      </div>
      <div className="text-lg">
        <text className="font-semibold">Display Name: </text>
        <text className="font-normal">{props.user.display_name}</text>
      </div>
      <div>
        <text className="font-semibold">{ShowServiceName(props.user.used_service)}: </text>
        <text className="font-normal">{props.user.service_id}</text>
      </div>
    </Card>
  );
}

export function WebHoundUsers(props: { users: WebHoundUser[] }) {
  return (
    <div className="grid grid-cols-[1fr]">{props.users.map((user) => WebHoundUser({ user }))}</div>
  );
}

export function WebHoundRequest(props: { request: WebHoundRequest }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request on {props.request.created_on}</CardTitle>
        <CardDescription>
          <div>
            Created at {props.request.created_at} by {props.request.created_by.display_name}
          </div>
          <div>
            Service: {ShowServiceName(props.request.created_by.used_service)}, Id:{" "}
            {props.request.created_by.service_id}
          </div>
        </CardDescription>
        <CardContent>
          {props.request.results.map((request) => (
            <div>
              <div className="text-lg font-semibold">{request.service}</div>
              <ScrollArea className="text-sm font-light">{request.result}</ScrollArea>
            </div>
          ))}
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export function WebHoundRequests(props: { requests: WebHoundRequest[] }) {
  return (
    <div className="flex flex-col gap-2">
      {props.requests.map((request) => WebHoundRequest({ request }))}
    </div>
  );
}
