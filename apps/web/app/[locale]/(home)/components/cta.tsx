import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { Calculator, MessageSquare } from "lucide-react";
import Link from "next/link";
import { QuoteModal } from "@/app/[locale]/components/quote-modal";

interface CTAProps {
  dictionary: Dictionary;
}

export const CTA = ({ dictionary }: CTAProps) => (
  <div className="w-full pb-10 lg:pb-20">
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-8 rounded-md bg-muted p-4 text-center lg:p-14">
        <div className="flex flex-col gap-2">
          <h3 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
            {dictionary.web.home.cta.title}
          </h3>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed tracking-tight">
            {dictionary.web.home.cta.description}
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Button asChild className="gap-4" size="lg">
            <Link href="/painting-cost-calculator">
              {dictionary.web.home.hero.cta}{" "}
              <Calculator className="h-4 w-4" />
            </Link>
          </Button>
          <QuoteModal dictionary={dictionary} source="FinalCTA">
            <Button className="gap-4" size="lg" variant="outline">
              {dictionary.web.header.getQuote}{" "}
              <MessageSquare className="h-4 w-4" />
            </Button>
          </QuoteModal>
        </div>
      </div>
    </div>
  </div>
);
