import type { Credentials } from "@/transport/dtos/credentials";

export const WebHoundTesting___Credentials: Credentials[] = [
  {
    title: "my_credentials_1",
    telegram: {
      api_id: "my_api_id_1",
      api_hash: "my_api_hash_1",
    },
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
    telegram: {
      api_id: "my_api_id_2",
      api_hash: "my_api_hash_2",
    },
    instagram: undefined,
    steam: undefined,
  },
  { title: "my_credentials_3", telegram: undefined, instagram: undefined, steam: undefined },
];
