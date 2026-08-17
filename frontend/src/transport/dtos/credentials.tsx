export interface Credentials {
  title: string;
  instagram: { login: string; password: string } | undefined;
  steam: { web_api_key: string } | undefined;
}
