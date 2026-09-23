import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

import { LeadStatusSelect } from "./LeadStatusSelect";

describe("LeadStatusSelect", () => {
  it("shows the current status", () => {
    render(<LeadStatusSelect value="NEW" onChange={vi.fn()} />);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("opens status options", async () => {
    const user = userEvent.setup();

    render(<LeadStatusSelect value="NEW" onChange={vi.fn()} />);

    await user.click(
      screen.getByRole("combobox", {
        name: /update lead status/i,
      }),
    );

    expect(screen.getByText("Contacted")).toBeInTheDocument();

    expect(screen.getByText("Qualified")).toBeInTheDocument();

    expect(screen.getByText("Converted")).toBeInTheDocument();

    expect(screen.getByText("Lost")).toBeInTheDocument();
  });

  it("calls onChange with the selected status", async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();

    render(<LeadStatusSelect value="NEW" onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));

    await user.click(screen.getByText("Qualified"));

    expect(onChange).toHaveBeenCalledWith("QUALIFIED");
  });

  it("does not call onChange for the current status", async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();

    render(<LeadStatusSelect value="NEW" onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));

    const newOptions = screen.getAllByText("New");

    await user.click(newOptions[newOptions.length - 1]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables status updates while loading", () => {
    render(<LeadStatusSelect value="NEW" disabled onChange={vi.fn()} />);

    expect(screen.getByRole("combobox")).toBeDisabled();

    expect(screen.getByText("Updating")).toBeInTheDocument();
  });
});
