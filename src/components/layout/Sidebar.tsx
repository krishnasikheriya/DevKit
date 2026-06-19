/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Braces,
  KeyRound,
  SearchCode,
  Binary,
  Link as LinkIcon,
  Hash,
  Fingerprint,
  Clock,
  Palette,
  Type,
  AlignLeft,
  Database,
  QrCode,
  FileText,
} from "lucide-react";

const TOOL_CATEGORIES = [
  {
    name: "Converters",
    tools: [
      { name: "Epoch Converter", href: "/epoch", icon: Clock },
      { name: "Color Converter", href: "/color", icon: Palette },
    ],
  },
  {
    name: "Formatters",
    tools: [
      { name: "JSON Formatter", href: "/", icon: Braces },
      { name: "SQL Formatter", href: "/sql", icon: Database },
    ],
  },
  {
    name: "Encoders / Decoders",
    tools: [
      { name: "JWT Decoder", href: "/jwt", icon: KeyRound },
      { name: "Base64 Encoder", href: "/base64", icon: Binary },
      { name: "URL Encoder", href: "/url", icon: LinkIcon },
    ],
  },
  {
    name: "Generators",
    tools: [
      { name: "Hash Generator", href: "/hash", icon: Hash },
      { name: "UUID Generator", href: "/uuid", icon: Fingerprint },
      { name: "QR Code Generator", href: "/qr", icon: QrCode },
    ],
  },
  {
    name: "Text & Parsing",
    tools: [
      { name: "Regex Tester", href: "/regex", icon: SearchCode },
      { name: "Text Case Converter", href: "/text-case", icon: Type },
      { name: "Lorem Ipsum", href: "/lorem", icon: AlignLeft },
      { name: "Markdown Previewer", href: "/markdown", icon: FileText },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-64 border-r border-border/40 bg-background/60 backdrop-blur-2xl text-foreground flex flex-col h-full z-20">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <img src="/image.png" alt="DevKit" className="w-6 h-6 rounded-md shadow-sm" />
          <span className="font-bold text-lg tracking-wide">DevKit</span>
        </div>
      </div>

      <ScrollArea className="flex-1 py-6 px-4">
        <div className="space-y-6">
          {TOOL_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {category.name}
              </h3>
              <nav className="space-y-1">
                {category.tools.map((tool) => {
                  const isActive = pathname === tool.href;
                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-300 text-sm font-medium",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <tool.icon
                        className={cn(
                          "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {tool.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
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
