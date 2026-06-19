"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Loader2 } from "lucide-react";
import { CommandMenu } from "@/components/layout/CommandMenu";

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
  const title = ROUTE_TITLES[pathname] || "Dashboard";

  const handleSignOut = () => {
    setIsSigningOut(true);
    signOut();
  };

  return (
    <div className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-2xl flex items-center justify-between px-6 z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <CommandMenu />
      </div>

      <div className="flex items-center gap-4">
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
