"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/design-system/components/ui/radio-group";
import { cn } from "@repo/design-system/lib/utils";
import type { Dictionary } from "@repo/internationalization";
import type { LucideIcon } from "lucide-react";
import { RockingChair, TentTree } from "lucide-react";
import { useState } from "react";
import { QuoteModal } from "@/app/[locale]/components/quote-modal";
import {
  type CalculatorState,
  CUSTOM_CARPET_AREA_MAX,
  CUSTOM_CARPET_AREA_MIN,
  HOUSE_SIZE_RANGES,
  HOUSE_SIZES,
  type HouseSize,
  type PaintingType,
  type PartOfHouse,
  type QuotePayload,
} from "../lib/pricing";
import { InfoTooltip } from "./info-tooltip";

interface ScreenHouseDetailsProps {
  dictionary: Dictionary;
  onChange: (patch: Partial<CalculatorState>) => void;
  onNext: () => void;
  onQuoteSuccess: () => void;
  payload: QuotePayload;
  state: CalculatorState;
}

const FieldGroup = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="flex flex-col gap-3">
    <h2 className="font-medium text-lg">{title}</h2>
    {children}
  </div>
);

interface PartOfHouseOptionProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  tooltip: string;
  value: PartOfHouse;
}

const PartOfHouseOption = ({
  icon: Icon,
  label,
  selected,
  tooltip,
  value,
}: PartOfHouseOptionProps) => (
  <label
    className={cn(
      "flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
      selected ? "border-primary bg-primary/5" : "border-input"
    )}
    htmlFor={`part-of-house-${value}`}
  >
    <RadioGroupItem
      className="sr-only"
      id={`part-of-house-${value}`}
      value={value}
    />
    <Icon className="h-6 w-6" />
    <span className="flex items-center gap-1.5 font-medium">
      {label}
      <InfoTooltip content={tooltip} />
    </span>
  </label>
);

interface PaintingTypeOptionProps {
  label: string;
  selected: boolean;
  subtext: string;
  tooltip: string;
  value: PaintingType;
}

const PaintingTypeOption = ({
  label,
  selected,
  subtext,
  tooltip,
  value,
}: PaintingTypeOptionProps) => (
  <label
    className={cn(
      "flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-colors",
      selected ? "border-primary bg-primary/5" : "border-input"
    )}
    htmlFor={`painting-type-${value}`}
  >
    <RadioGroupItem
      className="sr-only"
      id={`painting-type-${value}`}
      value={value}
    />
    <span className="flex items-center gap-1.5 font-medium">
      {label}
      <InfoTooltip content={tooltip} />
    </span>
    <span className="text-muted-foreground text-sm">{subtext}</span>
  </label>
);

export const ScreenHouseDetails = ({
  dictionary,
  onChange,
  onNext,
  onQuoteSuccess,
  payload,
  state,
}: ScreenHouseDetailsProps) => {
  const copy = dictionary.web.paintingCostCalculator.screen1;
  const [showCustomArea, setShowCustomArea] = useState(
    state.customCarpetArea !== null
  );
  const [customAreaInput, setCustomAreaInput] = useState(
    state.customCarpetArea?.toString() ?? ""
  );
  const [customAreaError, setCustomAreaError] = useState<string | null>(null);

  const handleCustomAreaChange = (value: string) => {
    setCustomAreaInput(value);

    if (value.trim() === "") {
      setCustomAreaError(null);
      onChange({ customCarpetArea: null });
      return;
    }

    const parsed = Number(value);

    if (
      !Number.isInteger(parsed) ||
      parsed < CUSTOM_CARPET_AREA_MIN ||
      parsed > CUSTOM_CARPET_AREA_MAX
    ) {
      setCustomAreaError(copy.houseSize.customAreaError);
      onChange({ customCarpetArea: null });
      return;
    }

    setCustomAreaError(null);
    onChange({ customCarpetArea: parsed });
  };

  const isExterior = state.partOfHouse === "exterior";
  const isRental = state.paintingType === "rental";

  const canProceed =
    state.partOfHouse === "interior" &&
    state.houseSize !== null &&
    state.paintingType !== null &&
    customAreaError === null;

  const data = JSON.stringify(payload);

  return (
    <div className="flex flex-col gap-8">
      <FieldGroup title={copy.partOfHouse.title}>
        <RadioGroup
          className="grid grid-cols-2 gap-4"
          onValueChange={(value) =>
            onChange({ partOfHouse: value as PartOfHouse })
          }
          value={state.partOfHouse ?? undefined}
        >
          <PartOfHouseOption
            icon={RockingChair}
            label={copy.partOfHouse.interior.label}
            selected={state.partOfHouse === "interior"}
            tooltip={copy.partOfHouse.interior.tooltip}
            value="interior"
          />
          <PartOfHouseOption
            icon={TentTree}
            label={copy.partOfHouse.exterior.label}
            selected={state.partOfHouse === "exterior"}
            tooltip={copy.partOfHouse.exterior.tooltip}
            value="exterior"
          />
        </RadioGroup>
      </FieldGroup>

      {isExterior && (
        <div className="flex flex-col items-start gap-4 rounded-lg border bg-muted/40 p-4">
          <p className="text-muted-foreground text-sm">
            {copy.partOfHouse.exteriorMessage}
          </p>
          <QuoteModal data={data} dictionary={dictionary} source="Calculator">
            <Button>{copy.partOfHouse.getQuoteCta}</Button>
          </QuoteModal>
        </div>
      )}

      {!isExterior && (
        <>
          <FieldGroup title={copy.houseSize.title}>
            <RadioGroup
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              onValueChange={(value) =>
                onChange({ houseSize: value as HouseSize })
              }
              value={state.houseSize ?? undefined}
            >
              {HOUSE_SIZES.map((size) => (
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 font-medium text-sm transition-colors",
                    state.houseSize === size
                      ? "border-primary bg-primary/5"
                      : "border-input"
                  )}
                  htmlFor={`house-size-${size}`}
                  key={size}
                >
                  <RadioGroupItem
                    className="sr-only"
                    id={`house-size-${size}`}
                    value={size}
                  />
                  {copy.houseSize.options[size]}
                </label>
              ))}
            </RadioGroup>

            {state.houseSize && (
              <p className="text-muted-foreground text-sm">
                {copy.houseSize.explainerPrefix}{" "}
                <strong className="text-foreground">
                  {copy.houseSize.options[state.houseSize]}
                </strong>{" "}
                {copy.houseSize.explainerMiddle}{" "}
                <strong className="text-foreground">
                  {HOUSE_SIZE_RANGES[state.houseSize].min}–
                  {HOUSE_SIZE_RANGES[state.houseSize].max}
                </strong>{" "}
                {copy.houseSize.explainerSuffix}{" "}
                {showCustomArea ? null : (
                  <button
                    className="text-primary underline underline-offset-2"
                    onClick={() => setShowCustomArea(true)}
                    type="button"
                  >
                    {copy.houseSize.customAreaLink}
                  </button>
                )}
              </p>
            )}

            {showCustomArea && (
              <div className="flex flex-col gap-1">
                <Input
                  inputMode="numeric"
                  onChange={(event) =>
                    handleCustomAreaChange(event.target.value)
                  }
                  placeholder={copy.houseSize.customAreaPlaceholder}
                  value={customAreaInput}
                />
                {customAreaError && (
                  <p className="text-destructive text-sm">{customAreaError}</p>
                )}
              </div>
            )}
          </FieldGroup>

          <FieldGroup title={copy.paintingType.title}>
            <RadioGroup
              className="grid gap-3 sm:grid-cols-3"
              onValueChange={(value) =>
                onChange({ paintingType: value as PaintingType })
              }
              value={state.paintingType ?? undefined}
            >
              <PaintingTypeOption
                label={copy.paintingType.fresh.label}
                selected={state.paintingType === "fresh"}
                subtext={copy.paintingType.fresh.subtext}
                tooltip={copy.paintingType.fresh.tooltip}
                value="fresh"
              />
              <PaintingTypeOption
                label={copy.paintingType.repainting.label}
                selected={state.paintingType === "repainting"}
                subtext={copy.paintingType.repainting.subtext}
                tooltip={copy.paintingType.repainting.tooltip}
                value="repainting"
              />
              <PaintingTypeOption
                label={copy.paintingType.rental.label}
                selected={state.paintingType === "rental"}
                subtext={copy.paintingType.rental.subtext}
                tooltip={copy.paintingType.rental.tooltip}
                value="rental"
              />
            </RadioGroup>
          </FieldGroup>

          {isRental ? (
            <QuoteModal
              cta={dictionary.web.paintingCostCalculator.quoteModal.cta}
              data={data}
              dictionary={dictionary}
              onSuccess={onQuoteSuccess}
              source="Calculator"
              title={dictionary.web.paintingCostCalculator.quoteModal.title}
            >
              <Button className="w-full" disabled={!canProceed}>
                {copy.next}
              </Button>
            </QuoteModal>
          ) : (
            <Button className="w-full" disabled={!canProceed} onClick={onNext}>
              {copy.next}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
