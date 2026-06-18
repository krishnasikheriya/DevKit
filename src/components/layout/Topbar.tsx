"use client";

import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const ROUTE_TITLES: Record<string, string> = {
  "/": "JSON Formatter",
  "/jwt": "JWT Decoder",
  "/regex": "Regex Tester",
  "/base64": "Base64 Encoder",
};

export function Topbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // Dynamically resolve tool name based on the route string fallback to 'Dashboard'
  const currentToolName = ROUTE_TITLES[pathname] || "DevKit Tool";

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-white dark:bg-slate-950">
      <div className="font-semibold text-sm">
        {currentToolName}
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {status === "loading" ? (
          <span className="text-xs text-slate-400">Loading...</span>
        ) : session ? (
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign Out
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