import { getPortfolioData } from "@/lib/data";
import { PublicPortfolio } from "@/components/public/public-portfolio";
import { VisitorTracker } from "@/components/public/visitor-tracker";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();
  return (
    <>
      <VisitorTracker />
      <PublicPortfolio data={data} />
    </>
  );
}
