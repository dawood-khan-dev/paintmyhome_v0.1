import { about } from "@repo/cms";
import { Body } from "@repo/cms/components/body";
import { Feed } from "@repo/cms/components/feed";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const generateMetadata = async (): Promise<Metadata> => {
  const aboutContent = await about.getAbout();

  return createMetadata({
    title: aboutContent?.title ?? "About PaintMyHome",
    description: aboutContent?.summary ?? "Our story is coming soon.",
  });
};

const About = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <Feed draft={false} queries={[about.aboutQuery]}>
        {async ([data]) => {
          "use server";

          const aboutContent = data.about;

          return (
            <div className="mx-auto flex max-w-prose flex-col items-center gap-4 text-center">
              <div className="flex flex-col gap-2">
                <h1 className="max-w-xl text-center font-regular text-3xl tracking-tighter md:text-5xl">
                  {aboutContent?.title ?? "About PaintMyHome"}
                </h1>
                <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
                  {aboutContent?.summary ?? "Our story is coming soon."}
                </p>
              </div>
              {aboutContent?.body ? (
                <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-left">
                  <Body content={aboutContent.body.json.content} />
                </div>
              ) : undefined}
            </div>
          );
        }}
      </Feed>
    </div>
  </div>
);

export default About;
