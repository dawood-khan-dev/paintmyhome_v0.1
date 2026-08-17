"use client";

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

export const Calculator = ({ dictionary }: CalculatorProps) => {
  const [step, setStep] = useState<Step>("details");
  const [state, setState] = useState<CalculatorState>(INITIAL_CALCULATOR_STATE);

  const updateState = (patch: Partial<CalculatorState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const payload = useMemo(() => buildQuotePayload(state), [state]);

  return (
    <div className="w-full py-12 lg:py-20">
      <div className="container mx-auto max-w-2xl">
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
    </div>
  );
};
