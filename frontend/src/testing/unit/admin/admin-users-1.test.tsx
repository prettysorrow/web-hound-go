import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { WebHoundUsersMenu } from "@/admin/layouts";

test("show webhound users for admin panel", async () => {
  render(<WebHoundUsersMenu />);

  expect(await screen.findAllByText("Display Name:")).toHaveLength(1);
  expect(await screen.findByText("Artem")).toBeInTheDocument();

  expect(await screen.findByText("GitHub:")).toBeInTheDocument();
  expect(await screen.findByText("prettysorrow")).toBeInTheDocument();
});
