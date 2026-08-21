import { guides } from "@repo/cms";
import type { Dictionary } from "@repo/internationalization";
import Link from "next/link";

interface GuidesGridProps {
  dictionary: Dictionary;
}

export const GuidesGrid = async ({ dictionary }: GuidesGridProps) => {
  const copy = dictionary.web.home.guides;
  const homepageGuides = await guides.getHomepageGuides();

  if (!homepageGuides.length) {
    return null;
  }

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
            {homepageGuides.map((guide) => (
              <Link
                className="flex h-full flex-col gap-4 rounded-md bg-muted p-6 text-left"
                href={`/guides/${guide._slug}`}
                key={guide._slug}
              >
                <h3 className="text-xl tracking-tight">{guide._title}</h3>
                <p className="text-base text-muted-foreground">
                  {guide.summary}
                </p>
                <span className="mt-auto text-sm underline-offset-4 hover:underline">
                  {copy.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
