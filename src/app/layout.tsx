import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "@/providers";
import '@rainbow-me/rainbowkit/styles.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autopilot Finance",
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50 flex w-full max-w-none">
          <Providers>
            <div className="flex w-full max-w-none min-w-full">
              <div className="w-80 flex-shrink-0">
                <Sidebar/>
              </div>
              <main className="flex-1 min-w-0 w-full max-w-none" style={{ width: 'calc(100vw - 320px)' }}>
                {children}
              </main>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
