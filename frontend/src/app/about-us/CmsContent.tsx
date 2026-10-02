
"use client";

import { useEffect } from "react";

// Resolved at Next.js build/render time (this file is compiled by Next.js,
// unlike the CMS HTML string below, which is raw runtime content).
const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000";

export default function CmsContent({ html }: { html: string }) {
  // CMS content stores the environment-independent placeholder "__LARAVEL_API_URL__"
  // instead of a hardcoded domain (e.g. in <img src> or fetch() calls). It is resolved
  // here, right before rendering, so the same stored content works correctly in every
  // environment without ever hardcoding a local/UAT/production domain in the database.
  const resolvedHtml = html.replaceAll("__LARAVEL_API_URL__", LARAVEL_API_URL);

  // Re-run any <script> tags inside the CMS HTML content
  useEffect(() => {
    const container = document.getElementById("cms-page-content");
    if (!container) return;

    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return <div id="cms-page-content" dangerouslySetInnerHTML={{ __html: resolvedHtml }} />;
}


