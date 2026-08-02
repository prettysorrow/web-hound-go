import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { WebHoundTesting___BackendHandlers } from "./mocks/webhound";

export const server = setupServer(...WebHoundTesting___BackendHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
