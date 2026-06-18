 
"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";

export default function RegexTesterPage() {
  const [regex, setRegex] = useLocalStorage("devkit-regex-pattern", "");
  const [flags, setFlags] = useLocalStorage("devkit-regex-flags", "g");
  const [testString, setTestString] = useLocalStorage("devkit-regex-input", "");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  // Dynamically evaluate the regex against the testString on changes
   
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    } catch (err) {
      setError((err as Error).message || "Invalid regular expression or flags");
    }
  }, [regex, flags, testString]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Regex Tester</h1>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Label className="text-slate-700 dark:text-slate-300">Regular Expression</Label>
          <div className="flex gap-2">
            <Input
              className="font-mono mt-1 border-slate-300 dark:border-slate-700 focus-visible:ring-primary"
              placeholder="^[a-z0-9]+$"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
            />
          </div>
        </div>
        <div className="w-24">
          <Label className="text-slate-700 dark:text-slate-300">Flags</Label>
          <Input
            className="font-mono mt-1 border-slate-300 dark:border-slate-700 focus-visible:ring-primary"
            placeholder="gim"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
          />
        </div>
      </div>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 rounded-lg border shadow-sm">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Test String
              </h2>
              <ClearInputButton onClear={() => setTestString("")} />
            </div>
            <div className="flex-1 overflow-hidden border rounded-md">
              <CodeMirror
                value={testString}
                height="100%"
                className="h-full text-base"
                theme={editorTheme}
                onChange={(value) => setTestString(value)}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="bg-slate-200 dark:bg-slate-800" />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 space-y-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Matches / Result
              </h2>
              <CopyToClipboard text={matches.join("\n")} />
            </div>
            {error ? (
              <div className="text-red-500 flex-1 p-4 border rounded-md font-mono bg-red-50 dark:bg-red-950/30 overflow-auto whitespace-pre-wrap shadow-inner">
                <span className="font-bold">Error:</span> {error}
              </div>
            ) : (
              <div className="flex-1 p-3 border rounded-md overflow-auto bg-white dark:bg-[#1e1e1e] shadow-inner font-mono text-sm">
                {matches.length > 0 ? (
                  <div className="space-y-1">
                    {matches.map((match, i) => (
                      <div
                        key={i}
                        className="p-1.5 px-2 bg-primary/10 dark:bg-primary/20 text-slate-800 dark:text-slate-200 rounded break-all border border-primary/20"
                      >
                        {match}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-400 dark:text-slate-500 italic flex items-center justify-center h-full">
                    No matches found.
                  </div>
                )}
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
