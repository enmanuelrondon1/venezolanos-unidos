//src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VenezuelaSolidaria — Ayuda entre venezolanos",
  description: "Conectamos a venezolanos que necesitan apoyo con personas dispuestas a ayudar. Comida, medicinas, trabajo, vivienda y más.",
  openGraph: {
    title: "VenezuelaSolidaria",
    description: "Conectamos a venezolanos que necesitan apoyo con personas dispuestas a ayudar.",
    locale: "es_VE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
