import { useWebHoundUsers } from "@/hooks/useWebHoundUsers";
import { WebHoundRequests, WebHoundUsers } from "@/entities/webhound";

import { Field, FieldGroup } from "@/components/ui/field";
import { useWebHoundRequests } from "@/hooks/useWebHoundRequests";

export function WebHoundUsersMenu() {
  let users = useWebHoundUsers();
  return <WebHoundUsers users={users} />;
}

export function WebHoundRequestsMenu() {
  let requests = useWebHoundRequests();
  return <WebHoundRequests requests={requests} />;
}

export function WebHoundStatisticsMenu() {
  let users = useWebHoundUsers();
  let requests = useWebHoundRequests();
  return (
    <div className="w-full">
      <FieldGroup className="w-1/3 mx-auto">
        <Field>
          <div>Users amount: {users.length}</div>
          <div>Requests amount: {requests.length}</div>
        </Field>
      </FieldGroup>
    </div>
  );
}
