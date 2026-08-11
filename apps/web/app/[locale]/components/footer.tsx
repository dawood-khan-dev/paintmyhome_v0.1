export const Footer = () => (
  <section className="dark border-foreground/10 border-t">
    <div className="w-full bg-background py-8 text-foreground">
      <div className="container mx-auto text-center text-foreground/75 text-sm">
        © {new Date().getFullYear()} PaintMyHome. All rights reserved.
      </div>
    </div>
  </section>
);
