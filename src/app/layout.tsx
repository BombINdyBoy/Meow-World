import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meow World — Heart Edition | Living Passport & Life Journey",
  description: "A gentle sanctuary for your pet's living passport, life journey moments, digital certificates, and family co-care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
