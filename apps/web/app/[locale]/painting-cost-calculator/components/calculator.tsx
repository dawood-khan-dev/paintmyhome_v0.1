"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { Dictionary } from "@repo/internationalization";
import { useMemo, useState } from "react";
import {
  buildQuotePayload,
  type CalculatorState,
  INITIAL_CALCULATOR_STATE,
  type Tier,
} from "../lib/pricing";
import { EstimateScreen } from "./estimate";
import { ScreenHouseDetails } from "./screen-house-details";
import { ScreenPreference } from "./screen-preference";

interface CalculatorProps {
  dictionary: Dictionary;
}

type Step = "details" | "preference" | "estimate";

const STEPS: Step[] = ["details", "preference", "estimate"];

const StepProgress = ({
  step,
  stepLabel,
}: {
  step: Step;
  stepLabel: string;
}) => {
  const currentIndex = STEPS.indexOf(step);
  const label = stepLabel
    .replace("{current}", String(currentIndex + 1))
    .replace("{total}", String(STEPS.length));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="flex gap-2">
        {STEPS.map((s, index) => (
          <div
            className={cn(
              "h-1.5 flex-1 rounded-full",
              index <= currentIndex ? "bg-primary" : "bg-muted"
            )}
            key={s}
          />
        ))}
      </div>
    </div>
  );
};

export const Calculator = ({ dictionary }: CalculatorProps) => {
  const [step, setStep] = useState<Step>("details");
  const [state, setState] = useState<CalculatorState>(INITIAL_CALCULATOR_STATE);

  const updateState = (patch: Partial<CalculatorState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const payload = useMemo(() => buildQuotePayload(state), [state]);

  return (
    <div className="flex flex-col gap-8">
      <StepProgress
        step={step}
        stepLabel={dictionary.web.paintingCostCalculator.progress.stepLabel}
      />
      {step === "details" && (
        <ScreenHouseDetails
          dictionary={dictionary}
          onChange={updateState}
          onNext={() => setStep("preference")}
          onQuoteSuccess={() => setStep("estimate")}
          payload={payload}
          state={state}
        />
      )}
      {step === "preference" && (
        <ScreenPreference
          dictionary={dictionary}
          onChange={(tier: Tier) => updateState({ tier })}
          onPrevious={() => setStep("details")}
          onQuoteSuccess={() => setStep("estimate")}
          payload={payload}
          tier={state.tier}
        />
      )}
      {step === "estimate" && (
        <EstimateScreen dictionary={dictionary} payload={payload} />
      )}
    </div>
  );
};
