import { useWebHoundFetching } from "@/hooks/useFetching";
import { WebHoundRequests, WebHoundUsers } from "@/components/entities/webhound";

import { Field, FieldGroup } from "@/components/ui/field";

export function WebHoundUsersMenu() {
  let data = useWebHoundFetching();
  return <WebHoundUsers users={data.users} />;
}

export function WebHoundRequestsMenu() {
  let data = useWebHoundFetching();
  return <WebHoundRequests requests={data.requests} />;
}

export function WebHoundStatisticsMenu() {
  let data = useWebHoundFetching();
  return (
    <div className="w-full">
      <FieldGroup className="w-1/3 mx-auto">
        <Field>
          <div>Users amount: {data.users.length}</div>
          <div>Requests amount: {data.requests.length}</div>
        </Field>
      </FieldGroup>
    </div>
  );
}
