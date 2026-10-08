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
import { architect, siteUrl } from "@/data/portfolio";
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
    default: `${architect.name} — Arquitetura`,
    template: `%s | ${architect.name}`,
  },
  description:
    "Portfólio de arquitetura e interiores com estudos demonstrativos sobre luz, materialidade e formas de habitar.",
  openGraph: {
    locale: "pt_BR",
    type: "website",
    title: `${architect.name} — Arquitetura`,
    description: "Estudos demonstrativos de arquitetura e interiores.",
    images: [
      {
        url: "/images/casa-patio.jpg",
        width: 1600,
        height: 1100,
        alt: "Fotografia de referência arquitetônica sem vínculo com o estudo Casa Pátio ou autoria da arquiteta",
      },
    ],
  },
  robots: { index: Boolean(process.env.NEXT_PUBLIC_SITE_URL), follow: true },
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
