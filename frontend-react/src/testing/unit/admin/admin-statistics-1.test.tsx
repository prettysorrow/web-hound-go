import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { WebHoundStatisticsMenu } from "@/admin/layouts";

test("show statistics for admin panel", async () => {
  render(<WebHoundStatisticsMenu />);
  expect(await screen.findByText("Users amount: 2")).toBeInTheDocument();
  expect(await screen.findByText("Requests amount: 2")).toBeInTheDocument();
});
