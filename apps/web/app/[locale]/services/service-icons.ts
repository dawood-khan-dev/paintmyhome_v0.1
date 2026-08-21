import type { LucideIcon } from "lucide-react";
import { Droplets, Hammer, Home, PaintRoller, Palette } from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "interior-painting": PaintRoller,
  "exterior-painting": Home,
  "texture-and-decorative-painting": Palette,
  waterproofing: Droplets,
  "wood-and-metal-painting": Hammer,
};

export const SERVICE_SLUGS = Object.keys(SERVICE_ICONS);
