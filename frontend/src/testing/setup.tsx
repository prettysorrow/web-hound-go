import "@testing-library/jest-dom";

import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { WebHoundTesting___BackendHandlers } from "./mocks/webhound";

export const backend = setupServer(...WebHoundTesting___BackendHandlers);
beforeAll(() => backend.listen({ onUnhandledRequest: "error" }));
afterEach(() => backend.resetHandlers());
afterAll(() => backend.close());
