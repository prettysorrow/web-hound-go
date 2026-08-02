import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { WebHoundUsersMenu } from "@/admin/layouts";

test("show webhound users for admin panel", async () => {
  render(<WebHoundUsersMenu />);

  expect(await screen.findAllByText("Display Name:")).toHaveLength(2);
  expect(await screen.findByText("Artem")).toBeInTheDocument();
  expect(await screen.findByText("Alexandra Yoshimura")).toBeInTheDocument();

  expect(await screen.findByText("Telegram:")).toBeInTheDocument();
  expect(await screen.findByText("letmedieinsorrow")).toBeInTheDocument();

  expect(await screen.findByText("GitHub:")).toBeInTheDocument();
  expect(await screen.findByText("prettysorrow")).toBeInTheDocument();
});
