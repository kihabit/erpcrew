"use client";

import { useEffect, useState } from "react";

const CALENDLY_URL = "https://calendly.com/keydynamicssolutions89/30min";

export default function CalendlyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // The iframe unmounts on close (see the `open &&` guard below), but this
    // component itself stays mounted — reset so the next open shows the
    // loading state again instead of a stale "loaded" iframe.
    if (!open) setIframeLoaded(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Warms the connection to Calendly's origin ahead of the click so the iframe
          (opened on demand, never preloaded) connects faster once the user opens it. */}
      <link rel="preconnect" href="https://calendly.com" />

      {open && (
        <div className="calendly-modal" role="dialog" aria-modal="true" aria-labelledby="calendly-modal-title">
          <button className="calendly-modal-backdrop" aria-label="Close scheduling window" onClick={onClose} />
          <div className="calendly-modal-panel">
            <div className="calendly-modal-header">
              <div>
                <p className="calendly-modal-eyebrow">KDS ERP Crew</p>
                <h2 id="calendly-modal-title">Schedule Your AI Audit</h2>
              </div>
              <button type="button" className="calendly-modal-close" onClick={onClose} aria-label="Close">
                ×
              </button>
            </div>

            <div style={{ position: "relative", flex: "1 1 auto", minHeight: 0, background: "#fff" }}>
              {!iframeLoaded && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    background: "#fff",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "9999px",
                      border: "3px solid #e2e8f0",
                      borderTopColor: "#2ababe",
                      animation: "calendly-modal-spin 0.8s linear infinite",
                    }}
                  />
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#475569" }}>Loading booking calendar…</p>
                  <style>{"@keyframes calendly-modal-spin{to{transform:rotate(360deg)}}"}</style>
                </div>
              )}
              <iframe
                title="Schedule Your AI Audit with Key Dynamics Solutions"
                src={CALENDLY_URL}
                className="calendly-modal-iframe"
                loading="eager"
                onLoad={() => setIframeLoaded(true)}
                style={{ display: "block", width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
