import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gonghack Web",
  description: "Next.js web project with TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
