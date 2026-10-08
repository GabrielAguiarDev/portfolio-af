import type { Metadata } from "next";
import localFont from "next/font/local";
const serif = localFont({
  src: [
    {
      path: "../../public/images/CormorantGaramond.woff2",
      style: "normal",
      weight: "300 700",
    },
    {
      path: "../../public/images/CormorantGaramond-Italic.woff2",
      style: "italic",
      weight: "300 700",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
const sans = localFont({
  src: "../../public/images/Inter.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { architect, siteUrl, siteTitle, siteDescription, socialImage } from "@/data/portfolio";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/brand/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" },
      { url: "/brand/favicon-32.png?v=2", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/brand/favicon.ico?v=2",
    apple: [{ url: "/brand/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
  title: {
    default: siteTitle,
    template: `%s | ${architect.name}`,
  },
  description: siteDescription,
  authors: [{ name: architect.name }],
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    siteName: `${architect.name} — Portfólio`,
    locale: "pt_BR",
    type: "website",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${serif.variable} ${sans.variable}`}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
