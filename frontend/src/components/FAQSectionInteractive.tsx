"use client";

import { useState } from "react";

type FAQItem = { question: string; answer: string };

export default function FAQSectionInteractive({
  eyebrow,
  heading,
  description,
  items,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items: FAQItem[];
}) {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq-section" className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-inner">
        <div className="faq-intro">
          <p className="faq-eyebrow">{eyebrow}</p>
          <h2 id="faq-heading">{heading}</h2>
          <p>{description}</p>
        </div>
        <div className="faq-list">
          {items.map((item, index) => (
            <details
              className="faq-item"
              open={open === index}
              key={`${item.question}-${index}`}
              onToggle={(event) => {
                if ((event.currentTarget as HTMLDetailsElement).open) setOpen(index);
              }}
            >
              <summary>{item.question}</summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
