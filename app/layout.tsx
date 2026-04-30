import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ads Creator PRO | Generatore di testi e script per Ads",
  description:
    "Crea testi Meta Ads, hook, headline, CTA e script video per TikTok, Instagram e Facebook in pochi secondi."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
