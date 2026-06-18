"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function RegexTesterPage() {
  const [regex, setRegex] = useLocalStorage("devkit-regex-pattern", "");
  const [flags, setFlags] = useLocalStorage("devkit-regex-flags", "g");
  const [testString, setTestString] = useLocalStorage("devkit-regex-input", "");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Dynamically evaluate the regex against the testString on changes
  useEffect(() => {
    setError(null);
    setMatches([]);

    if (!regex) return;

    try {
      let parsedRegex = regex;
      let parsedFlags = flags;
      
      // Auto-strip slashes if user pasted a full regex literal (e.g. /pattern/g)
      const literalMatch = regex.match(/^\/(.+)\/([gimsuy]*)$/);
      if (literalMatch) {
        parsedRegex = literalMatch[1];
        parsedFlags = literalMatch[2] || flags; // Use inline flags if provided, else fallback
      }

      const re = new RegExp(parsedRegex, parsedFlags);

      const matchResults = testString.match(re);
      
      if (matchResults) {
        setMatches(Array.from(matchResults));
      }
    } catch (err: any) {
      setError(err.message || "Invalid regular expression or flags");
    }
  }, [regex, flags, testString]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Regex Tester</h1>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Label>Regular Expression</Label>
          <Input
            className="font-mono mt-1"
            placeholder="^[a-z0-9]+$"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
          />
        </div>
        <div className="w-24">
          <Label>Flags</Label>
          <Input
            className="font-mono mt-1"
            placeholder="gim"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
          />
        </div>
      </div>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2">
            <h2 className="text-sm font-semibold mb-2">Test String</h2>
            <Textarea
              className="flex-1 font-mono resize-none"
              placeholder="Enter text to test your regex against..."
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 space-y-2">
            <h2 className="text-sm font-semibold mb-2">Matches / Result</h2>
            {error ? (
              <div className="text-red-500 p-2 border rounded-md">{error}</div>
            ) : (
              <div className="flex-1 p-2 border rounded-md overflow-auto bg-slate-50 dark:bg-slate-900 font-mono text-sm">
                {matches.length > 0 ? (
                  matches.map((match, i) => (
                    <div key={i} className="mb-1 p-1 bg-blue-100 dark:bg-blue-900 rounded break-all">
                      {match}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400">No matches found.</span>
                )}
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}