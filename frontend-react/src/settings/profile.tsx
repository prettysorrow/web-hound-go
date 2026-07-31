import { ShowServiceIcon, ShowServiceName } from "@/admin/services";
import { Field, FieldGroup } from "@/components/ui/field";
import { useWebhoundActiveUser } from "@/hooks/useWebhoundActiveUser";

export function WebHoundProfile() {
  let user = useWebhoundActiveUser();

  return (
    <div className="w-full">
      <div className="w-1/3 mx-auto">
        <FieldGroup>
          <Field>
            <h1>Hello, {user.display_name}!</h1>
          </Field>
          <Field orientation={"horizontal"}>
            <span>Used service:</span>
            <ShowServiceIcon size="20px" service={user.used_service} />
            <span>{ShowServiceName(user.used_service)}</span>
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
