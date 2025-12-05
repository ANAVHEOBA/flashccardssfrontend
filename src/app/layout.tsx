import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FlashcardProvider } from "@/contexts/FlashcardContext";
import { ProgressProvider } from "@/contexts/ProgressContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flashcards.ai - Master Programming Keywords",
  description: "Learn 517 essential programming keywords across 9 languages with AI-powered flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <FlashcardProvider>
              <ProgressProvider>{children}</ProgressProvider>
            </FlashcardProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
