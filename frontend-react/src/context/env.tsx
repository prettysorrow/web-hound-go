interface FrontendEnvVarsType {
  VITE_BACKEND_API_URL: string;
}

if (import.meta.env.VITE_BACKEND_API_URL === undefined) {
  throw new Error("VITE_BACKEND_API_URL is not specified in react frontend ");
}

const FrontendEnvVars: FrontendEnvVarsType = {
  VITE_BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL,
};

export default FrontendEnvVars;
