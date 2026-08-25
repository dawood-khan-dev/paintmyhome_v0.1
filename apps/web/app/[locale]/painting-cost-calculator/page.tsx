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
  const copy = dictionary.web.paintingCostCalculator.meta;

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="container mx-auto flex max-w-2xl flex-col gap-10">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="font-regular text-3xl tracking-tighter md:text-5xl">
            {copy.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed tracking-tight">
            {copy.description}
          </p>
        </div>
        <Calculator dictionary={dictionary} />
      </div>
    </div>
  );
};

export default PaintingCostCalculator;
