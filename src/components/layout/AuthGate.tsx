"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Loader2 } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignIn = () => {
    setIsLoggingIn(true);
    signIn("github");
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border p-8 flex flex-col items-center text-center space-y-6">
          <img src="/image.png" alt="DevKit Logo" className="w-16 h-16 rounded-xl shadow-sm" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to DevKit</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your ultimate developer utility dashboard. Please sign in to access the tools.
            </p>
          </div>
          <Button className="w-full" onClick={handleSignIn} disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In with GitHub"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
