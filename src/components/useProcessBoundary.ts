"use client";

import { useEffect, type RefObject } from "react";

/** Release the sticky model when the final step's top border reaches the header. */
export default function useProcessBoundary(ref: RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const list = ref.current;
    const last = list?.lastElementChild;
    const model = list?.closest(".process")?.querySelector<HTMLElement>(".process__model");
    const header = document.querySelector(".site-header");
    if (!list || !last || !model || !header) return;

    const enabled = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      if (!enabled.matches) {
        list.style.removeProperty("--process-tail");
        return;
      }
      const stickyTop = parseFloat(getComputedStyle(model).top) || 0;
      const bottomBorder = parseFloat(getComputedStyle(list).borderBottomWidth) || 0;
      const tail = Math.max(0,
        model.getBoundingClientRect().height + stickyTop
        - header.getBoundingClientRect().height
        - last.getBoundingClientRect().height - bottomBorder,
      );
      list.style.setProperty("--process-tail", `${tail}px`);
    };
    const observer = new ResizeObserver(measure);
    [model, last, header].forEach(element => observer.observe(element));
    enabled.addEventListener("change", measure);
    window.addEventListener("resize", measure, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      enabled.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
      list.style.removeProperty("--process-tail");
    };
  }, [ref]);
}
