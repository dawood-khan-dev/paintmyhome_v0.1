import type { Dictionary } from "@repo/internationalization";
import Link from "next/link";

interface FooterProps {
  dictionary: Dictionary;
}

export const Footer = ({ dictionary }: FooterProps) => {
  const navigationItems = [
    { title: dictionary.web.header.home, href: "/" },
    {
      title: dictionary.web.header.paintingCost,
      href: "/painting-cost-calculator",
    },
    { title: dictionary.web.header.services, href: "/services" },
    { title: dictionary.web.header.guides, href: "/guides" },
    { title: dictionary.web.header.about, href: "/about" },
  ];

  return (
    <section className="dark border-foreground/10 border-t">
      <div className="w-full bg-background py-12 text-foreground">
        <div className="container mx-auto flex flex-col gap-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-lg tracking-tight">
              PaintMyHome
            </span>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {navigationItems.map((item) => (
                <Link
                  className="text-foreground/75 hover:text-foreground"
                  href={item.href}
                  key={item.title}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col items-center gap-1 border-foreground/10 border-t pt-6 text-center text-foreground/75 text-sm sm:flex-row sm:justify-between sm:text-left">
            <div>
              © {new Date().getFullYear()} PaintMyHome by Habitera Technologies.
              All rights reserved.
            </div>
            <div className="text-foreground/50 text-xs">
              Images by{" "}
              <a
                className="underline hover:text-foreground/75"
                href="https://magnific.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Magnific
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
