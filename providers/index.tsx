"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <Toaster
        richColors
        position="top-center"
        closeButton
      />
    </ThemeProvider>
  );
}