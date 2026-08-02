import { WithCredentials } from "@/hooks/useCredentials";
import { WebHoundCredentials } from "@/settings/credentials";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

test("enter title for new credentials", async () => {
  const user = userEvent.setup();
  render(
    <WithCredentials>
      <WebHoundCredentials />
    </WithCredentials>,
  );
  const textbox = await screen.findByPlaceholderText("Enter credentials title...");
  await user.type(textbox, "my-new-credentials");
  expect(textbox).toHaveValue("my-new-credentials");
});
