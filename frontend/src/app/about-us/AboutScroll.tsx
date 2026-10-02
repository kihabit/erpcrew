"use client";

import { useEffect } from "react";

export default function AboutScroll() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (
      params.get("from") !== "agent-library" ||
      window.location.hash !== "#contact-form"
    ) {
      return;
    }

    const scrollToForm = () => {
      const element = document.getElementById("contact-form");

      if (!element) return;

      const headerOffset = 100;

      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth",
      });

      // Remove trigger from URL
      window.history.replaceState(
        null,
        "",
        "/about-us#contact-form"
      );
    };

    // Allow CMS content/layout to render first
    const timer = setTimeout(scrollToForm, 300);

    return () => clearTimeout(timer);
  }, []);

  return null;
}