"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Braces,
  KeyRound,
  SearchCode,
  Binary,
  User,
  LogOut,
  Link as LinkIcon,
  Hash,
  Fingerprint,
  Clock,
  Palette,
  Type,
  AlignLeft,
  Database,
} from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSession, signOut } from "next-auth/react";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-md cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search tools...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search tools..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Converters">
              <CommandItem onSelect={() => runCommand(() => router.push("/epoch"))}>
                <Clock className="mr-2 h-4 w-4" />
                <span>Epoch Converter</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/color"))}>
                <Palette className="mr-2 h-4 w-4" />
                <span>Color Converter</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Formatters">
              <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
                <Braces className="mr-2 h-4 w-4" />
                <span>JSON Formatter</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/sql"))}>
                <Database className="mr-2 h-4 w-4" />
                <span>SQL Formatter</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Encoders / Decoders">
              <CommandItem onSelect={() => runCommand(() => router.push("/jwt"))}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>JWT Decoder</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/base64"))}>
                <Binary className="mr-2 h-4 w-4" />
                <span>Base64 Encoder</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/url"))}>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>URL Encoder</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Generators">
              <CommandItem onSelect={() => runCommand(() => router.push("/hash"))}>
                <Hash className="mr-2 h-4 w-4" />
                <span>Hash Generator</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/uuid"))}>
                <Fingerprint className="mr-2 h-4 w-4" />
                <span>UUID Generator</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Text & Parsing">
              <CommandItem onSelect={() => runCommand(() => router.push("/regex"))}>
                <SearchCode className="mr-2 h-4 w-4" />
                <span>Regex Tester</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/text-case"))}>
                <Type className="mr-2 h-4 w-4" />
                <span>Text Case Converter</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/lorem"))}>
                <AlignLeft className="mr-2 h-4 w-4" />
                <span>Lorem Ipsum Generator</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />
            {session && (
              <CommandGroup heading="Account">
                <CommandItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{session.user?.name || "Profile"}</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => signOut())}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
