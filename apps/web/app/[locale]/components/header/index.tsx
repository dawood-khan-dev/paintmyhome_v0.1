"use client";

import { Button } from "@repo/design-system/components/ui/button";
import type { Dictionary } from "@repo/internationalization";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QuoteModal } from "@/app/[locale]/components/quote-modal";

interface HeaderProps {
  dictionary: Dictionary;
}

export const Header = ({ dictionary }: HeaderProps) => {
  const navigationItems = [
    {
      title: dictionary.web.header.home,
      href: "/",
    },
    {
      title: dictionary.web.header.paintingCost,
      href: "/painting-cost-calculator",
    },
    {
      title: dictionary.web.header.services,
      href: "/services",
    },
    {
      title: dictionary.web.header.guides,
      href: "/guides",
    },
    {
      title: dictionary.web.header.about,
      href: "/about",
    },
  ];

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background">
      <div className="container relative mx-auto flex min-h-20 flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-8">
          <Image
            alt="PaintMyHome logo"
            className="h-20 w-auto"
            height={464}
            priority
            src="/logo_full.png"
            width={1883}
          />
          <div className="hidden flex-row items-center gap-4 lg:flex">
            {navigationItems.map((item) => (
              <Button asChild key={item.title} variant="ghost">
                <Link href={item.href}>{item.title}</Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <QuoteModal dictionary={dictionary}>
            <Button className="hidden md:inline">
              {dictionary.web.header.getQuote}
            </Button>
          </QuoteModal>
        </div>
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <Button onClick={() => setOpen(!isOpen)} variant="ghost">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {isOpen && (
            <div className="container absolute top-20 right-0 flex w-full flex-col gap-8 border-t bg-background py-4 shadow-lg">
              {navigationItems.map((item) => (
                <Link className="text-lg" href={item.href} key={item.title}>
                  {item.title}
                </Link>
              ))}
              <QuoteModal dictionary={dictionary}>
                <Button>{dictionary.web.header.getQuote}</Button>
              </QuoteModal>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
