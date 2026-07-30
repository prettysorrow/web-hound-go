interface FrontendEnvVarsType {
  VITE_USE_TESTING_DATA: boolean;
  VITE_BACKEND_API_URL: string;
}

if (import.meta.env.VITE_BACKEND_API_URL === undefined) {
  throw new Error("VITE_BACKEND_API_URL is not specified in react frontend ");
}

if (import.meta.env.VITE_USE_TESTING_DATA === undefined) {
  throw new Error("VITE_USE_TESTING_DATA is not specified in react frontend ");
}

const FrontendEnvVars: FrontendEnvVarsType = {
  VITE_BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL,
  VITE_USE_TESTING_DATA: import.meta.env.VITE_USE_TESTING_DATA === "true",
};

export default FrontendEnvVars;
