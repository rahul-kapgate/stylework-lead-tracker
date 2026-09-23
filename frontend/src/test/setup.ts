import "@testing-library/jest-dom/vitest";
import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";

import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

window.matchMedia =
  window.matchMedia ||
  (() =>
    ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList);

window.HTMLElement.prototype.scrollIntoView = vi.fn();

window.HTMLElement.prototype.hasPointerCapture = vi.fn();

window.HTMLElement.prototype.setPointerCapture = vi.fn();

window.HTMLElement.prototype.releasePointerCapture = vi.fn();

if (!window.PointerEvent) {
  window.PointerEvent = MouseEvent as unknown as typeof PointerEvent;
}
