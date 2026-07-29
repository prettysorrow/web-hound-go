export type LoginServices = "telegram" | "gmail";

export interface WebHoundUser {
  used_service: LoginServices;
  service_id: string;
  display_name: string;
}

export interface WebHoundRequest {
  created_at: string;
  created_on: string;
  created_by: WebHoundUser;
  results: { service: string; result: any }[];
}

export interface WebHoundDataToFetch {
  users: WebHoundUser[];
  requests: WebHoundRequest[];
}
