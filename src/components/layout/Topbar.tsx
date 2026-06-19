"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Loader2, Menu } from "lucide-react";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/layout/Sidebar";

const ROUTE_TITLES: Record<string, string> = {
  "/": "JSON Formatter",
  "/jwt": "JWT Decoder",
  "/regex": "Regex Tester",
  "/base64": "Base64 Encoder",
  "/url": "URL Encoder",
  "/hash": "Hash Generator",
  "/uuid": "UUID Generator",
  "/epoch": "Epoch Converter",
  "/color": "Color Converter",
  "/text-case": "Text Case Converter",
  "/lorem": "Lorem Ipsum Generator",
  "/sql": "SQL Formatter",
};

export function Topbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const title = ROUTE_TITLES[pathname] || "Dashboard";

  const handleSignOut = () => {
    setIsSigningOut(true);
    signOut();
  };

  return (
    <div className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-2xl flex items-center justify-between px-4 md:px-6 z-20 sticky top-0 shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-9 w-9 md:hidden shrink-0">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col w-64 border-r-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex-1 flex flex-col min-h-0">
              <SidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg md:text-xl font-semibold tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-none">
          {title}
        </h1>
        <div className="hidden sm:block">
          <CommandMenu />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="sm:hidden">
          <CommandMenu />
        </div>
        <ThemeToggle />
        {status === "loading" ? (
          <span className="text-xs text-slate-400">Loading...</span>
        ) : session ? (
          <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Out...
              </>
            ) : (
              "Sign Out"
            )}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => signIn("github")}>
            Sign In with GitHub
          </Button>
        )}
      </div>
    </div>
  );
}
