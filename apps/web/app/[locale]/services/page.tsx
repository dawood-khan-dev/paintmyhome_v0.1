import { services } from "@repo/cms";
import { Feed } from "@repo/cms/components/feed";
import { Image } from "@repo/cms/components/image";
import { getDictionary } from "@repo/internationalization";
import type { CollectionPage, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_ICONS } from "./service-icons";

export const dynamic = "force-static";

interface ServicesIndexProps {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: ServicesIndexProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.services.meta);
};

const ServicesIndex = async ({ params }: ServicesIndexProps) => {
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
            <h1 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl">
              {dictionary.web.services.meta.title}
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feed draft={false} queries={[services.servicesQuery]}>
              {async ([data]) => {
                "use server";

                if (!data.services.items.length) {
                  return null;
                }

                return data.services.items.map((service) => {
                  const Icon = SERVICE_ICONS[service._slug];

                  return (
                    <Link
                      className="flex h-full flex-col gap-4 rounded-md bg-muted p-6 text-left hover:opacity-75"
                      href={`/services/${service._slug}`}
                      key={service._slug}
                    >
                      {service.coverImage ? (
                        <Image
                          alt={service.coverImage.alt ?? ""}
                          className="rounded-md"
                          height={service.coverImage.height}
                          src={service.coverImage.url}
                          width={service.coverImage.width}
                        />
                      ) : (
                        Icon && <Icon className="h-6 w-6 stroke-1" />
                      )}
                      <div className="flex flex-col gap-2">
                        <h3 className="text-xl tracking-tight">
                          {service._title}
                        </h3>
                        <p className="text-base text-muted-foreground">
                          {service.summary}
                        </p>
                      </div>
                    </Link>
                  );
                });
              }}
            </Feed>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesIndex;
