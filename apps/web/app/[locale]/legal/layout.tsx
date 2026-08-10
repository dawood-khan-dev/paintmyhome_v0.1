import { Toolbar } from "@repo/cms/components/toolbar";
import type { ReactNode } from "react";

interface LegalLayoutProps {
  children: ReactNode;
}

const LegalLayout = ({ children }: LegalLayoutProps) => (
  <>
    {children}
    {process.env.BASEHUB_TOKEN && <Toolbar />}
  </>
);

export default LegalLayout;
