import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { services } from "@repo/cms";
import { Body } from "@repo/cms/components/body";
import { Feed } from "@repo/cms/components/feed";
import { Image } from "@repo/cms/components/image";
import type { Service as ServiceType, WithContext } from "@repo/seo/json-ld";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/env";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const url = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

interface ServicePageProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: ServicePageProperties): Promise<Metadata> => {
  const { slug } = await params;
  const service = await services.getService(slug);

  if (!service) {
    return {};
  }

  return createMetadata({
    title: service._title,
    description: service.summary,
    image: service.coverImage?.url,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const allServices = await services.getServices();

  return allServices.map(({ _slug }) => ({ slug: _slug }));
};

const ServicePage = async ({ params }: ServicePageProperties) => {
  const { slug } = await params;

  return (
    <Feed queries={[services.serviceQuery(slug)]}>
      {async ([data]) => {
        "use server";

        const service = data.services.item;

        if (!service) {
          notFound();
        }

        return (
          <>
            <JsonLd
              code={
                {
                  "@type": "Service",
                  "@context": "https://schema.org",
                  description: service.summary,
                  name: service._title,
                  image: service.coverImage?.url,
                  url: new URL(
                    `/services/${service._slug}`,
                    url
                  ).toString(),
                } satisfies WithContext<ServiceType>
              }
            />
            <div className="container mx-auto py-16">
              <Link
                className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
                href="/services"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Services
              </Link>
              <div className="mx-auto mt-16 max-w-prose">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-5xl">
                    {service._title}
                  </h1>
                  <p className="text-balance leading-7 [&:not(:first-child)]:mt-6">
                    {service.summary}
                  </p>
                  {service.coverImage ? (
                    <Image
                      alt={service.coverImage.alt ?? ""}
                      className="my-16 h-full w-full rounded-xl"
                      height={service.coverImage.height}
                      priority
                      src={service.coverImage.url}
                      width={service.coverImage.width}
                    />
                  ) : undefined}
                  <Body content={service.body.json.content} />
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Feed>
  );
};

export default ServicePage;
