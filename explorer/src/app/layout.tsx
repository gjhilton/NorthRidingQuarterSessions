import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NRQS Explorer",
  description: "Browse and visualise the North Riding Quarter Sessions dataset",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
