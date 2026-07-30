import type { WebHoundUser, WebHoundRequest } from "@/transport/dtos/webhound";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShowServiceName, ShowServiceIcon } from "@/admin/services";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitHubUserVerbose } from "@/results/github";

function WebHoundUser(props: { user: WebHoundUser }) {
  return (
    <Card className="flex p-4">
      <div className="text-base">
        <text className="font-semibold">Display Name: </text>
        <text className="font-normal">{props.user.display_name}</text>
      </div>
      <div className="flex gap-1 content-center">
        <Badge className="text-sm font-semibold" variant="outline">
          {props.user.used_service}
        </Badge>
        <ShowServiceIcon service={props.user.used_service} size="18px" />
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

export function WebHoundResult(props: { service: string; result: any }) {
  return (
    <div>
      <div className="text-lg font-semibold">Results for {props.service}</div>
      <pre className="text-sm font-mono bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(props.result, null, 2)}
      </pre>
    </div>
  );
}

export function WebHoundResults(props: { results: { service: string; result: any }[] }) {
  if (props.results.length === 0) {
    return <div className="text-lg font-semibold">Empty results</div>;
  }

  return (
    <div>
      {props.results.map((result) => (
        <WebHoundResult service={result.service} result={result.result} />
      ))}
    </div>
  );
}

export function WebHoundRequest(props: { request: WebHoundRequest }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request on {props.request.created_on}</CardTitle>
        <CardDescription>
          <div>Created by {props.request.created_by.display_name}</div>
          <div>Author service: {ShowServiceName(props.request.created_by.used_service)}</div>
          <div>Author service id: {props.request.created_by.service_id}</div>
          <div>Created at {props.request.created_at}</div>
        </CardDescription>
        <CardContent>
          <WebHoundResults results={props.request.results} />
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export function WebHoundRequests(props: { requests: WebHoundRequest[] }) {
  return (
    <div className="flex flex-col gap-2">
      {props.requests.map((request) => (
        <WebHoundRequest request={request} />
      ))}
    </div>
  );
}
