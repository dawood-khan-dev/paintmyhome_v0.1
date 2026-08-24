import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { guides } from "@repo/cms";
import { Body } from "@repo/cms/components/body";
import { Feed } from "@repo/cms/components/feed";
import { Image } from "@repo/cms/components/image";
import { TableOfContents } from "@repo/cms/components/toc";
import { JsonLd } from "@repo/seo/json-ld";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { env } from "@/env";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const url = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

interface GuidePageProperties {
  readonly params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: GuidePageProperties): Promise<Metadata> => {
  const { slug } = await params;
  const guide = await guides.getGuide(slug);

  if (!guide) {
    return {};
  }

  return createMetadata({
    title: guide._title,
    description: guide.summary,
    image: guide.coverImage?.url,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const allGuides = await guides.getGuides();

  return allGuides.map(({ _slug }) => ({ slug: _slug }));
};

const GuidePage = async ({ params }: GuidePageProperties) => {
  const { slug } = await params;

  return (
    <Feed draft={false} queries={[guides.guideQuery(slug)]}>
      {async ([data]) => {
        "use server";

        const guide = data.guides.item;

        if (!guide) {
          notFound();
        }

        return (
          <>
            <JsonLd
              code={{
                "@type": "Article",
                "@context": "https://schema.org",
                description: guide.summary,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": new URL(`/guides/${guide._slug}`, url).toString(),
                },
                headline: guide._title,
                image: guide.coverImage?.url,
                dateModified: guide.lastUpdated,
                isAccessibleForFree: true,
              }}
            />
            <div className="container mx-auto py-16">
              <Link
                className="mb-4 inline-flex items-center gap-1 text-muted-foreground text-sm focus:underline focus:outline-none"
                href="/guides"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Guides
              </Link>
              <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row">
                <div className="sm:flex-1">
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight lg:text-5xl">
                      {guide._title}
                    </h1>
                    <p className="text-balance leading-7 [&:not(:first-child)]:mt-6">
                      {guide.summary}
                    </p>
                    {guide.coverImage ? (
                      <Image
                        alt={guide.coverImage.alt ?? ""}
                        className="my-16 h-full w-full rounded-xl"
                        height={guide.coverImage.height}
                        priority
                        src={guide.coverImage.url}
                        width={guide.coverImage.width}
                      />
                    ) : undefined}
                    <div className="mx-auto max-w-prose">
                      <Body content={guide.body.json.content} />
                    </div>
                  </div>
                </div>
                <div className="sticky top-24 hidden shrink-0 md:block">
                  <Sidebar
                    lastUpdated={new Date(guide.lastUpdated)}
                    readingTime={`${guide.body.readingTime} min read`}
                    toc={<TableOfContents data={guide.body.json.toc} />}
                  />
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Feed>
  );
};

export default GuidePage;
