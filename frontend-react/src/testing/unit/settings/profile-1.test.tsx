import { WebHoundProfile } from "@/settings/profile";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("show profile info", async () => {
  render(<WebHoundProfile />);
  expect(await screen.findByText("Hello, Artem!")).toBeInTheDocument();
  expect(await screen.findByText("Used service:")).toBeInTheDocument();
  expect(await screen.findByText("GitHub")).toBeInTheDocument();
});
