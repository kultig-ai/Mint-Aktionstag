import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: Bei eigener Domain hier anpassen.
const SITE_URL = "https://kultig-ai.github.io/Mint-Aktionstag";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Axtwerfen lernen – Schritt für Schritt zur ersten steckenden Axt",
    template: "%s | Axtwerfen lernen",
  },
  description:
    "Lerne Axtwerfen mit interaktiven Anleitungen: Sicherheitsregeln, richtiger Griff, Körperhaltung, Rotation & Abstand – plus Übungsspiel und Standortsuche für Anfänger.",
  keywords: [
    "Axtwerfen lernen",
    "Axt werfen lernen",
    "Axtwerfen Anleitung",
    "Axtwerfen Technik",
    "Axtwerfen Tipps",
    "Axtwerfen Anfänger",
    "Axtwerfen in der Nähe",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: "Axtwerfen lernen",
    title: "Axtwerfen lernen – Schritt für Schritt",
    description:
      "Interaktive Lernplattform: Vom ersten Griff bis zum Treffer in der Zielscheibe – mit Animationen, Simulation und Übungsspiel.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#14110e" },
  ],
};

/** Strukturierte Daten: Lernangebot als Course. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Axtwerfen lernen – interaktiver Anfängerkurs",
  description:
    "Kostenloser interaktiver Online-Kurs: Sicherheit, Grifftechnik, Körperhaltung, Wurfablauf und Rotation beim Axtwerfen.",
  provider: { "@type": "Organization", name: "Axtwerfen lernen" },
  inLanguage: "de",
  isAccessibleForFree: true,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme & Einstellungen vor dem ersten Paint anwenden (verhindert Flackern) */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            var s = JSON.parse(localStorage.getItem("axt-settings") || "{}");
            var dark = s.theme === "dark" || ((s.theme === "system" || !s.theme) && matchMedia("(prefers-color-scheme: dark)").matches);
            var c = document.documentElement.classList;
            if (dark) c.add("dark");
            if (s.reduceMotion) c.add("reduce-motion");
            if (s.largeText) c.add("large-text");
          } catch (e) {}`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
