import { WebHoundSearch } from "@/searching/search";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

test("enter username to textbox in the search page", async () => {
  const user = userEvent.setup();
  render(<WebHoundSearch />);
  const textbox = await screen.findByPlaceholderText("Enter username...");
  await user.type(textbox, "prettysorrow");
  expect(textbox).toHaveValue("prettysorrow");
});
