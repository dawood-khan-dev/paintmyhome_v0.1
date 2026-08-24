import { guides } from "@repo/cms";
import { Feed } from "@repo/cms/components/feed";
import { Image } from "@repo/cms/components/image";
import { cn } from "@repo/design-system/lib/utils";
import { getDictionary } from "@repo/internationalization";
import type { CollectionPage, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";

interface GuidesIndexProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: GuidesIndexProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.guides.meta);
};

const GuidesIndex = async ({ params }: GuidesIndexProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  const jsonLd: WithContext<CollectionPage> = {
    "@type": "CollectionPage",
    "@context": "https://schema.org",
  };

  return (
    <>
      <JsonLd code={jsonLd} />
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto flex flex-col gap-14">
          <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
              {dictionary.web.guides.meta.title}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Feed draft={false} queries={[guides.guidesQuery]}>
              {async ([data]) => {
                "use server";

                if (!data.guides.items.length) {
                  return null;
                }

                return data.guides.items.map((guide, index) => (
                  <Link
                    className={cn(
                      "flex cursor-pointer flex-col gap-4 hover:opacity-75",
                      !index && "md:col-span-2"
                    )}
                    href={`/guides/${guide._slug}`}
                    key={guide._slug}
                  >
                    {guide.coverImage ? (
                      <Image
                        alt={guide.coverImage.alt ?? ""}
                        height={guide.coverImage.height}
                        src={guide.coverImage.url}
                        width={guide.coverImage.width}
                      />
                    ) : undefined}
                    <div className="flex flex-row items-center gap-4">
                      <p className="text-muted-foreground text-sm">
                        {new Date(guide.lastUpdated).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "Asia/Kolkata",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="max-w-3xl text-4xl tracking-tight">
                        {guide._title}
                      </h3>
                      <p className="max-w-3xl text-base text-muted-foreground">
                        {guide.summary}
                      </p>
                    </div>
                  </Link>
                ));
              }}
            </Feed>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuidesIndex;
