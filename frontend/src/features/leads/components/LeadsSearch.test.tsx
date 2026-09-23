import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

import { LeadsSearch } from "./LeadsSearch";

describe("LeadsSearch", () => {
  it("renders the search input", () => {
    render(<LeadsSearch value="" onChange={vi.fn()} />);

    expect(
      screen.getByRole("searchbox", {
        name: /search leads/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows the search value", () => {
    render(<LeadsSearch value="Rahul" onChange={vi.fn()} />);

    expect(screen.getByRole("searchbox")).toHaveValue("Rahul");
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();

    render(<LeadsSearch value="" onChange={onChange} />);

    await user.type(screen.getByRole("searchbox"), "R");

    expect(onChange).toHaveBeenCalledWith("R");
  });

  it("shows clear button when search has a value", () => {
    render(<LeadsSearch value="Rahul" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", {
        name: /clear search/i,
      }),
    ).toBeInTheDocument();
  });

  it("clears search when clear button is clicked", async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();

    render(<LeadsSearch value="Rahul" onChange={onChange} />);

    await user.click(
      screen.getByRole("button", {
        name: /clear search/i,
      }),
    );

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("displays a validation error", () => {
    render(
      <LeadsSearch
        value="@@@"
        onChange={vi.fn()}
        error="Enter a valid search."
      />,
    );

    expect(screen.getByText("Enter a valid search.")).toBeInTheDocument();

    expect(screen.getByRole("searchbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not show clear button while searching", () => {
    render(<LeadsSearch value="Rahul" onChange={vi.fn()} isSearching />);

    expect(
      screen.queryByRole("button", {
        name: /clear search/i,
      }),
    ).not.toBeInTheDocument();
  });
});
