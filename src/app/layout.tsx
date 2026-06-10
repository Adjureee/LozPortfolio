import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/providers";
import { TerminalProvider } from "@/components/providers/terminal-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Loz | Developer Portfolio",
  description: "Creative developer crafting dynamic, interactive web experiences and robust applications.",
  keywords: ["Loz", "Developer", "Portfolio", "Software Engineer", "Web Development"],
  authors: [{ name: "Loz" }],
  openGraph: {
    title: "Loz | Developer Portfolio",
    description: "Creative developer crafting dynamic, interactive web experiences and robust applications.",
    type: "website",
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`} suppressHydrationWarning>
        <TerminalProvider>
          <Providers>
            {children}
            <Toaster position="bottom-right" theme="dark" />
          </Providers>
        </TerminalProvider>
      </body>
    </html>
  );
}
