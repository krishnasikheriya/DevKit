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
};

export function Topbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Dynamically resolve tool name based on the route string fallback to 'Dashboard'
  const currentToolName = ROUTE_TITLES[pathname] || "DevKit Tool";

  const handleSignOut = () => {
    setIsSigningOut(true);
    signOut();
  };

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-white dark:bg-slate-950">
      <div className="font-semibold text-sm flex items-center gap-4">
        {currentToolName}
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
