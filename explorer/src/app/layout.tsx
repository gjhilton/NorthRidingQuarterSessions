import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { css } from "styled-system/css";
import Nav from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { siteTitle } from "@/lib/siteName";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    title: siteTitle(),
    description: "Browse and visualise the North Riding Quarter Sessions dataset",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className={css({ display: "flex", flexDirection: "column", minHeight: "100vh" })}>
        <Nav />
        <div className={css({ flex: "1" })}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
