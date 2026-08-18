import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ServicePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const dictionary = await getDictionary("en");

  return dictionary.web.home.services.items.map((item) => ({
    slug: item.slug,
  }));
};

export const generateMetadata = async ({
  params,
}: ServicePageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  const dictionary = await getDictionary(locale);
  const service = dictionary.web.home.services.items.find(
    (item) => item.slug === slug
  );

  if (!service) {
    return {};
  }

  return createMetadata({
    title: service.title,
    description: service.description,
  });
};

const ServicePage = async ({ params }: ServicePageProps) => {
  const { locale, slug } = await params;
  const dictionary = await getDictionary(locale);
  const service = dictionary.web.home.services.items.find(
    (item) => item.slug === slug
  );

  if (!service) {
    notFound();
  }

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <Link
          className="mb-8 inline-flex items-center gap-1 text-muted-foreground text-sm hover:underline focus:underline focus:outline-none"
          href="/services"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Services
        </Link>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="max-w-xl text-center font-regular text-3xl tracking-tighter md:text-5xl">
              {service.title}
            </h1>
            <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
              Details about this service are coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
