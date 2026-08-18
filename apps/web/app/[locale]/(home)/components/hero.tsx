import { blog } from "@repo/cms";
import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { Calculator, MessageSquare, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuoteModal } from "@/app/[locale]/components/quote-modal";

interface HeroProps {
  dictionary: Dictionary;
}

export const Hero = async ({ dictionary }: HeroProps) => {
  const latestPost = await blog.getLatestPost();

  return (
    <div className="relative w-full overflow-hidden">
      <Image
        alt=""
        className="object-cover"
        fill
        priority
        src="/hero_background.jpg"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40 lg:pl-64">
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
            <h1 className="max-w-2xl text-center font-regular text-5xl text-white tracking-tighter md:text-7xl">
              {dictionary.web.home.meta.title}
            </h1>
            <p className="max-w-2xl text-center text-lg text-white/80 leading-relaxed tracking-tight md:text-xl">
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
