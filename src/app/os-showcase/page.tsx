import { getPortfolioData } from "@/lib/data";
import { ShowcasePage } from "./showcase-page";

export const dynamic = "force-dynamic";

export default async function OSShowcase() {
  const data = await getPortfolioData();
  return <ShowcasePage data={data} />;
}
