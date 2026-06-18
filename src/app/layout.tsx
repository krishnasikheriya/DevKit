import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthGate } from "@/components/layout/AuthGate";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevKit",
  description: "Your ultimate developer utility dashboard",
  icons: {
    icon: "/image.png",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthGate>
              <QueryProvider>
                <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
                  <Sidebar />
                  <div className="flex-1 flex flex-col min-w-0">
                    <Topbar />
                    <main className="flex-1 overflow-auto">{children}</main>
                  </div>
                </div>
              </QueryProvider>
            </AuthGate>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
