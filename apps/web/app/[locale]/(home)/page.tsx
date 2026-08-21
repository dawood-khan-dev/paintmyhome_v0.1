import { showBetaFeature } from "@repo/feature-flags";
import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { CTA } from "./components/cta";
import { GuidesGrid } from "./components/guides";
import { Hero } from "./components/hero";
import { HowWeHelpGrid } from "./components/how-we-help";
import { ServicesGrid } from "./components/services";
import { WhyPaintMyHome } from "./components/why-paintmyhome";

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero dictionary={dictionary} />
      <HowWeHelpGrid dictionary={dictionary} />
      <ServicesGrid dictionary={dictionary} />
      <GuidesGrid dictionary={dictionary} />
      <WhyPaintMyHome dictionary={dictionary} />
      <CTA dictionary={dictionary} />
    </>
  );
};

export default Home;
