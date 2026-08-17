import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { Calculator } from "./components/calculator";

interface PaintingCostCalculatorProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: PaintingCostCalculatorProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.paintingCostCalculator.meta);
};

const PaintingCostCalculator = async ({
  params,
}: PaintingCostCalculatorProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return <Calculator dictionary={dictionary} />;
};

export default PaintingCostCalculator;
