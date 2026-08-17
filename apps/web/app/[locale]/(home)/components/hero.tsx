import { blog } from "@repo/cms";
import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { Calculator, MessageSquare, MoveRight } from "lucide-react";
import Link from "next/link";
import { QuoteModal } from "@/app/[locale]/components/quote-modal";

interface HeroProps {
  dictionary: Dictionary;
}

export const Hero = async ({ dictionary }: HeroProps) => {
  const latestPost = await blog.getLatestPost();

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          {latestPost && (
            <div>
              <Button asChild className="gap-4" size="sm" variant="secondary">
                <Link href={`/guides/${latestPost._slug}`}>
                  {dictionary.web.home.hero.announcement}{" "}
                  <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
              {dictionary.web.home.meta.title}
            </h1>
            <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
              {dictionary.web.home.meta.description}
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button asChild className="gap-4" size="lg">
              <Link href="/painting-cost-calculator">
                {dictionary.web.home.hero.cta}{" "}
                <Calculator className="h-4 w-4" />
              </Link>
            </Button>
            <QuoteModal dictionary={dictionary} source="Hero">
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
};
