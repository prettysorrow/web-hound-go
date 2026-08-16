import type { Credentials } from "@/transport/dtos/credentials";

export const WebHoundTesting___Credentials: Credentials[] = [
  {
    title: "my_credentials_1",
    instagram: {
      login: "my_login_1",
      password: "my_password_1",
    },
    steam: {
      web_api_key: "my_web_api_key_1",
    },
  },
  {
    title: "my_credentials_2",
    instagram: undefined,
    steam: undefined,
  },
  { title: "my_credentials_3", instagram: undefined, steam: undefined },
];
