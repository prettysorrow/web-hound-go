export interface Credentials {
  telegram: { api_id: string; api_hash: string } | undefined;
  instagram: { login: string; password: string } | undefined;
  steam: { web_api_key: string } | undefined;
}
