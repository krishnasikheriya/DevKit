"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border p-8 flex flex-col items-center text-center space-y-6">
          <img src="/image.png" alt="DevKit Logo" className="w-16 h-16 rounded-xl shadow-sm" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to DevKit</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your ultimate developer utility dashboard. Please sign in to access the tools.
            </p>
          </div>
          <Button className="w-full" onClick={() => signIn("github")}>
            Sign In with GitHub
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
