import type { Dictionary } from "@repo/internationalization";
import {
  Calculator,
  ClipboardList,
  MessageSquare,
  SwatchBook,
} from "lucide-react";
import Link from "next/link";
import { QuoteModal } from "@/app/[locale]/components/quote-modal";

interface HowWeHelpProps {
  dictionary: Dictionary;
}

const icons = [Calculator, SwatchBook, ClipboardList, MessageSquare];

const cardClassName =
  "flex h-full flex-col gap-4 rounded-md bg-muted p-6 text-left";

export const HowWeHelpGrid = ({ dictionary }: HowWeHelpProps) => {
  const copy = dictionary.web.home.howWeHelp;

  return (
    <div className="w-full pt-10 pb-20 lg:pt-20 lg:pb-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
            {copy.title}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {copy.items.map((item, index) => {
              const Icon = icons[index];
              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 stroke-1" />
                    <h3 className="text-xl tracking-tight">{item.title}</h3>
                  </div>
                  <p className="text-base text-muted-foreground">
                    {item.description}
                  </p>
                </>
              );

              if (index === 0) {
                return (
                  <Link
                    className={cardClassName}
                    href="/painting-cost-calculator"
                    key={item.title}
                  >
                    {content}
                  </Link>
                );
              }

              if (index === copy.items.length - 1) {
                return (
                  <QuoteModal
                    dictionary={dictionary}
                    key={item.title}
                    source="HowWeHelp"
                  >
                    <button className={cardClassName} type="button">
                      {content}
                    </button>
                  </QuoteModal>
                );
              }

              return (
                <div className={cardClassName} key={item.title}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
