import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import type { Dictionary } from "@repo/internationalization";
import {
  calculateEstimate,
  formatCurrencyRange,
  formatSqft,
  type QuotePayload,
} from "../lib/pricing";

interface EstimateScreenProps {
  dictionary: Dictionary;
  payload: QuotePayload;
}

export const EstimateScreen = ({
  dictionary,
  payload,
}: EstimateScreenProps) => {
  const copy = dictionary.web.paintingCostCalculator.estimate;

  if (
    !payload.paintingType ||
    payload.paintableAreaSqft === null ||
    payload.carpetAreaUsedSqft === null
  ) {
    return null;
  }

  const estimate = calculateEstimate(
    payload.paintingType,
    payload.paintableAreaSqft,
    payload.tier
  );

  if (!estimate) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-lg">{copy.title}</h2>
        <p className="font-semibold text-3xl tracking-tight">
          {formatCurrencyRange(estimate.low, estimate.high)}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <span>
          <span className="text-muted-foreground">
            {copy.carpetAreaLabel}:{" "}
          </span>
          <span className="font-medium">
            {formatSqft(payload.carpetAreaUsedSqft)}
          </span>
        </span>
        <span>
          <span className="text-muted-foreground">
            {copy.paintableAreaLabel}:{" "}
          </span>
          <span className="font-medium">
            {formatSqft(payload.paintableAreaSqft)}
          </span>
        </span>
        {payload.tier && (
          <span>
            <span className="text-muted-foreground">
              {copy.preferenceLabel}:{" "}
            </span>
            <span className="font-medium">
              {
                dictionary.web.paintingCostCalculator.screen2[payload.tier]
                  .label
              }
            </span>
          </span>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.tableCoatHeader}</TableHead>
            <TableHead>{copy.tableRateHeader}</TableHead>
            <TableHead className="text-right">
              {copy.tableSubtotalHeader}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estimate.breakdown.map((coat) => (
            <TableRow key={coat.coat}>
              <TableCell>
                {coat.coat} ({coat.coats} coat{coat.coats > 1 ? "s" : ""})
              </TableCell>
              <TableCell>
                {coat.rateLow} – {coat.rateHigh}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrencyRange(coat.low, coat.high)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold">
              {copy.tableTotalLabel}
            </TableCell>
            <TableCell />
            <TableCell className="text-right font-semibold">
              {formatCurrencyRange(estimate.low, estimate.high)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
