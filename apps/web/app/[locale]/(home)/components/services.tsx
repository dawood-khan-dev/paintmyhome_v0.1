import type { Dictionary } from "@repo/internationalization";
import { Droplets, Hammer, Home, PaintRoller, Palette } from "lucide-react";
import Link from "next/link";

interface ServicesGridProps {
  dictionary: Dictionary;
}

const icons = [PaintRoller, Home, Palette, Droplets, Hammer];

export const ServicesGrid = ({ dictionary }: ServicesGridProps) => {
  const copy = dictionary.web.home.services;

  return (
    <div className="w-full pt-5 pb-20 lg:pt-10 lg:pb-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
              {copy.title}
            </h2>
            <p className="text-left text-lg text-muted-foreground leading-relaxed tracking-tight">
              {copy.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {copy.items.map((item, index) => {
              const Icon = icons[index];

              return (
                <Link
                  className="flex h-full flex-col gap-4 rounded-md bg-muted p-6 text-left"
                  href={`/services/${item.slug}`}
                  key={item.slug}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 stroke-1" />
                    <h3 className="text-xl tracking-tight">{item.title}</h3>
                  </div>
                  <p className="text-base text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-auto text-sm underline-offset-4 hover:underline">
                    {copy.cta} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
