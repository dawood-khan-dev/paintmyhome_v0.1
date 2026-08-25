import { services } from "@repo/cms";
import { Image } from "@repo/cms/components/image";
import type { Dictionary } from "@repo/internationalization";
import Link from "next/link";
import { SERVICE_ICONS, SERVICE_SLUGS } from "../../services/service-icons";

interface ServicesGridProps {
  dictionary: Dictionary;
}

export const ServicesGrid = async ({ dictionary }: ServicesGridProps) => {
  const copy = dictionary.web.home.services;
  const allServices = await services.getServices();
  const serviceBySlug = new Map(
    allServices.map((service) => [service._slug, service])
  );

  const items = SERVICE_SLUGS.map((slug) => serviceBySlug.get(slug)).filter(
    (service) => service !== undefined
  );

  if (!items.length) {
    return null;
  }

  return (
    <div className="w-full pb-10 lg:pb-20">
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
            {items.map((service) => {
              const Icon = SERVICE_ICONS[service._slug];

              return (
                <Link
                  className="flex h-full flex-col gap-4 rounded-md bg-muted p-6 text-left"
                  href={`/services/${service._slug}`}
                  key={service._slug}
                >
                  {service.coverImage ? (
                    <Image
                      alt={service.coverImage.alt ?? ""}
                      className="aspect-video w-full rounded-md object-cover"
                      height={service.coverImage.height}
                      src={service.coverImage.url}
                      width={service.coverImage.width}
                    />
                  ) : undefined}
                  <div className="flex items-center gap-3">
                    {Icon ? <Icon className="h-6 w-6 stroke-1" /> : undefined}
                    <h3 className="text-xl tracking-tight">{service._title}</h3>
                  </div>
                  <p className="text-base text-muted-foreground">
                    {service.summary}
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
