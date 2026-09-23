import { act, renderHook } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("Rahul", 350));

    expect(result.current).toBe("Rahul");
  });

  it("does not update before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      {
        initialProps: {
          value: "",
        },
      },
    );

    rerender({
      value: "Rahul",
    });

    act(() => {
      vi.advanceTimersByTime(349);
    });

    expect(result.current).toBe("");
  });

  it("updates after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      {
        initialProps: {
          value: "",
        },
      },
    );

    rerender({
      value: "Rahul",
    });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current).toBe("Rahul");
  });

  it("resets the timer when value changes again", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      {
        initialProps: {
          value: "",
        },
      },
    );

    rerender({
      value: "Ra",
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({
      value: "Rahul",
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current).toBe("Rahul");
  });
});
