import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip = ({ content }: InfoTooltipProps) => (
  <Tooltip>
    <TooltipTrigger
      asChild
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <span className="text-muted-foreground hover:text-foreground">
        <Info className="h-3.5 w-3.5" />
      </span>
    </TooltipTrigger>
    <TooltipContent>{content}</TooltipContent>
  </Tooltip>
);
