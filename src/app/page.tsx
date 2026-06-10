import { getPortfolioData } from "@/lib/data";
import { PublicPortfolio } from "@/components/public/public-portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();
  return <PublicPortfolio data={data} />;
}
