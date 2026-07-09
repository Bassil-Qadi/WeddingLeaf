import type { Metadata, Viewport } from "next";
import Providers from "@/providers";
import { arabic, amiri, cairo, cormorant } from "@/config/fonts";
import { APP } from "@/config/app";
import { designSystem } from "@/config/design-system";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP.name} | ${APP.tagline}`,
    template: `%s | ${APP.name}`,
  },
  description: APP.description,
  openGraph: {
    title: `${APP.name} | ${APP.tagline}`,
    description: APP.description,
    locale: "ar_JO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: designSystem.colors.background,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`
    ${cairo.variable}
    ${arabic.variable}
    ${amiri.variable}
    ${cormorant.variable}
    h-full
    antialiased
  `}
    >
      <body className="min-h-full flex flex-col">
      <Providers>
        {children}
    </Providers>
      </body>
    </html>
  );
}