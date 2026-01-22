import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WOODCHUCK USA | Custom Cutting + Assembly",
  description:
    "Upload your files. We cut it. We assemble it. Precision parts in acrylics, plastics, wood, composites, and veneer—built fast in the USA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
