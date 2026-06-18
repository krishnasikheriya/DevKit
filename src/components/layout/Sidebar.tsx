"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Braces, KeyRound, SearchCode, Binary } from "lucide-react";

const TOOLS = [
  { name: "JSON Formatter", href: "/", icon: Braces },
  { name: "JWT Decoder", href: "/jwt", icon: KeyRound },
  { name: "Regex Tester", href: "/regex", icon: SearchCode },
  { name: "Base64 Encoder", href: "/base64", icon: Binary },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-64 border-r h-full bg-slate-50 dark:bg-slate-900 flex flex-col">
      <div className="p-4 font-bold text-lg border-b flex items-center gap-2">
        <img src="/image.png" alt="DevKit Logo" className="w-6 h-6 rounded-md shadow-sm" />
        DevKit
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <div className="text-sm font-medium text-slate-500 mb-2 px-2 uppercase tracking-wider text-xs">Tools</div>

          {TOOLS.map((tool) => {
            const isActive = pathname === tool.href;
            const Icon = tool.icon;
            return (
              <Button
                key={tool.href}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                render={<Link href={tool.href} />}
                nativeButton={false}
              >
                <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                {tool.name}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t text-sm text-slate-500 flex flex-col gap-2">
        {session ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 overflow-hidden">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                {session.user?.name || "User"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-red-500 hover:text-red-600 px-2 h-7"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <span className="text-xs italic text-slate-400">Not signed in</span>
        )}
      </div>
    </div>
  );
}
