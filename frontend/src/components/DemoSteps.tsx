import { apiGet } from "@/lib/api";
import type { DemoStepsData } from "@/types";
import DemoStepsInteractive from "./DemoStepsInteractive";

export default async function DemoSteps() {
  const data = await apiGet<DemoStepsData>("/api/bottom-step-sliders", { next: { revalidate: 900 } }).catch(() => null);
  return <DemoStepsInteractive data={data} />;
}
