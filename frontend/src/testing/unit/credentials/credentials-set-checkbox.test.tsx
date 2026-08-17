import { WithCredentials } from "@/hooks/useCredentials";
import { WebHoundCredentials } from "@/settings/credentials/show";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

test("set instagram checkbox and ensure textboxes become visible", async () => {
  // setup
  render(
    <WithCredentials>
      <WebHoundCredentials />
    </WithCredentials>,
  );
  const user = userEvent.setup();

  // ensure textboxes are not on the screen
  expect(screen.queryByPlaceholderText("Enter Instagram login...")).not.toBeInTheDocument();
  expect(screen.queryByPlaceholderText("Enter Instagram password...")).not.toBeInTheDocument();

  // toggle checkbox
  const checkbox = await screen.findByRole("checkbox", { name: "instagram" });
  await user.click(checkbox);

  // ensure textboxes are on the screen
  expect(await screen.findByPlaceholderText("Enter Instagram login...")).toBeInTheDocument();
  expect(await screen.findByPlaceholderText("Enter Instagram password...")).toBeInTheDocument();
});
