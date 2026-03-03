import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"; // Assuming toaster component exists or can be added

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auricrypt - Field Service Management",
  description: "Enterprise plumbing service management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}