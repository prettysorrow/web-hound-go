import { WebHoundIndex } from "@/index";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";

test("shows about page", async () => {
  render(<WebHoundIndex />);
  expect(await screen.findByText("Web Hound")).toBeInTheDocument();
  expect(await screen.findByText("Search, Seek, Destroy.")).toBeInTheDocument();
});
