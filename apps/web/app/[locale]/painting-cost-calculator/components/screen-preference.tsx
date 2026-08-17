"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/design-system/components/ui/radio-group";
import { cn } from "@repo/design-system/lib/utils";
import type { Dictionary } from "@repo/internationalization";
import { BicepsFlexed, Droplets, Sparkles } from "lucide-react";
import { QuoteModal } from "@/app/[locale]/components/quote-modal";
import type { QuotePayload, Tier } from "../lib/pricing";

interface ScreenPreferenceProps {
  dictionary: Dictionary;
  onChange: (tier: Tier) => void;
  onPrevious: () => void;
  onQuoteSuccess: () => void;
  payload: QuotePayload;
  tier: Tier | null;
}

const TIERS: Tier[] = ["economy", "premium", "luxury"];

export const ScreenPreference = ({
  dictionary,
  onChange,
  onPrevious,
  onQuoteSuccess,
  payload,
  tier,
}: ScreenPreferenceProps) => {
  const copy = dictionary.web.paintingCostCalculator.screen2;
  const data = JSON.stringify(payload);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-medium text-lg">{copy.title}</h2>

      <RadioGroup
        className="grid gap-4 md:grid-cols-3"
        onValueChange={(value) => onChange(value as Tier)}
        value={tier ?? undefined}
      >
        {TIERS.map((tierOption) => {
          const tierCopy = copy[tierOption];

          return (
            <label
              className={cn(
                "flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors",
                tier === tierOption
                  ? "border-primary bg-primary/5"
                  : "border-input"
              )}
              htmlFor={`tier-${tierOption}`}
              key={tierOption}
            >
              <RadioGroupItem
                className="sr-only"
                id={`tier-${tierOption}`}
                value={tierOption}
              />
              <span className="font-medium">{tierCopy.label}</span>
              <span className="min-h-20 text-muted-foreground text-sm">
                {tierCopy.subtext}
              </span>
              <div className="flex flex-col gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  {tierCopy.finish}
                </span>
                <span className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 shrink-0" />
                  {tierCopy.washability}
                </span>
                <span className="flex items-center gap-2">
                  <BicepsFlexed className="h-4 w-4 shrink-0" />
                  {tierCopy.durability}
                </span>
              </div>
            </label>
          );
        })}
      </RadioGroup>

      <div className="flex gap-3">
        <Button className="flex-1" onClick={onPrevious} variant="outline">
          {copy.previous}
        </Button>
        <QuoteModal
          cta={dictionary.web.paintingCostCalculator.quoteModal.cta}
          data={data}
          dictionary={dictionary}
          onSuccess={onQuoteSuccess}
          source="Calculator"
          title={dictionary.web.paintingCostCalculator.quoteModal.title}
        >
          <Button className="flex-1" disabled={tier === null}>
            {copy.next}
          </Button>
        </QuoteModal>
      </div>
    </div>
  );
};
