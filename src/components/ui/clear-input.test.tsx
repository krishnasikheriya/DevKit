import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ClearInputButton } from "./clear-input";

describe("ClearInputButton", () => {
  it("renders correctly and calls onClear when clicked", () => {
    const handleClear = vi.fn();
    render(<ClearInputButton onClear={handleClear} />);

    const button = screen.getByRole("button", { name: /clear/i });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
