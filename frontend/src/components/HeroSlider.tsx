import { apiGet } from "@/lib/api";
import type { HeroSlide } from "@/types";
import HeroSliderInteractive from "./HeroSliderInteractive";

/* ------------------------------------------------------------------
 * Default Hero Image
 *
 * Used only as a fallback when a slide's API "image" is null/empty,
 * or when the API request fails entirely.
 * ------------------------------------------------------------------ */

export const DEFAULT_HERO_IMAGE = "/images/erp-crew-management.webp";

/* ------------------------------------------------------------------
 * Default Hero Slide
 * ------------------------------------------------------------------ */

export const DEFAULT_SLIDE: HeroSlide = {
  image: DEFAULT_HERO_IMAGE,

  image_alt_text: "ERP Crew Management",

  heading: ["AI-Powered Data", "Insights"],

  description:
    "Unlock meaningful business intelligence with AI-driven analytics, interactive dashboards, and real-time performance monitoring.",

  stats: [
    { value: "100+", number: "100+", label: "Data Connectors", icon: false },
    { value: "21+", number: "21+", label: "Business Functions", icon: false },
    { value: "10+", number: "10+", label: "Analytics Modules", icon: false },
    {
      value: "",
      number: "",
      label: "Always-On Decision Intelligence Assistant",
      icon: true,
    },
  ],

  buttons: [
    { text: "Agent Highlights", url: "#highlights" },
    { text: "Complete AI Agent Catalogue", url: "#catalogue" },
    { text: "Back to Key Dynamic Solutions", url: "https://keydynamicssolutions.com/" },
  ],
};

/* ------------------------------------------------------------------
 * Static CTA Buttons
 * ------------------------------------------------------------------ */

const STATIC_BUTTONS = [
  { text: "Agent Highlights", url: "#highlights" },
  { text: "Complete AI Agent Catalogue", url: "#catalogue" },
  { text: "Back to Key Dynamic Solutions", url: "https://keydynamicssolutions.com/" },
];

/* ------------------------------------------------------------------
 * Map API Hero Slide
 *
 * The API provides the actual CMS-uploaded image (slide.image),
 * heading, description, stats, and order. DEFAULT_HERO_IMAGE is
 * used only as a fallback when a slide has no image set.
 * ------------------------------------------------------------------ */

function mapHeroSlide(slide: any): HeroSlide {
  const stats = (slide.stats || []).map((stat: any) => {
    const number = String(stat.number || "").trim();
    const isNumeric = /^\d/.test(number);

    return isNumeric
      ? { value: number, number, label: stat.label || "", icon: false }
      : { value: "", number: "", label: stat.label || "", icon: true };
  });

  return {
    ...slide,

    /*
     * Use the real CMS-uploaded image from the API.
     * Falls back to DEFAULT_HERO_IMAGE only when a
     * slide has no image set.
     */
    image: slide.image || DEFAULT_HERO_IMAGE,

    image_alt_text: slide.image_alt_text || "",

    /*
     * Heading is split using "|".
     *
     * Example:
     *
     * Smart AI Approval|Assistant
     *
     * becomes:
     *
     * Smart AI Approval
     * Assistant
     */
    heading: String(slide.heading || "")
      .split("|")
      .map((line: string) => line.trim())
      .filter(Boolean),

    description: slide.description || "",

    stats,

    /*
     * Buttons are static across all slides.
     */
    buttons: STATIC_BUTTONS,
  };
}

/* ------------------------------------------------------------------
 * Extract API Slides
 *
 * Supports:
 *
 * { success: true, data: [...] }
 *
 * and:
 *
 * [...]
 * ------------------------------------------------------------------ */

function extractSlidesArray(response: any): any[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.data)) {
    if (response.success === false) {
      return [];
    }

    return response.data;
  }

  return [];
}

export default async function HeroSlider() {
  const slides = await apiGet<any>("/api/hero-slides", { next: { revalidate: 900 } })
    .then((response) => {
      const raw = extractSlidesArray(response);

      if (!raw.length) {
        return [DEFAULT_SLIDE];
      }

      /*
       * Sort by API order before mapping.
       */
      return raw
        .slice()
        .sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0))
        .map(mapHeroSlide);
    })
    .catch(() => [DEFAULT_SLIDE]);

  return <HeroSliderInteractive slides={slides} />;
}
