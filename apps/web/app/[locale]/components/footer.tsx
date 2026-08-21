export const Footer = () => (
  <section className="dark border-foreground/10 border-t">
    <div className="w-full bg-background py-8 text-foreground">
      <div className="container mx-auto flex flex-col items-center gap-1 text-center text-foreground/75 text-sm">
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
  </section>
);
