/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

export default function UuidGeneratorPage() {
  const [count, setCount] = useLocalStorage("devkit-uuid-count", "100");
  const [hyphens, setHyphens] = useLocalStorage("devkit-uuid-hyphens", true);
  const [uppercase, setUppercase] = useLocalStorage("devkit-uuid-uppercase", false);
  const [allUuids, setAllUuids] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;
  const pageSize = 100;

  const generateUuids = useCallback(() => {
    let num = parseInt(count, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > 100000) num = 100000; // Allow up to 100k since it's paged

    const uuids: string[] = [];
    for (let i = 0; i < num; i++) {
      let uuid = crypto.randomUUID();

      if (!hyphens) {
        uuid = uuid.replace(/-/g, "");
      }
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }

      uuids.push(uuid);
    }

    setAllUuids(uuids);
    setCurrentPage(1);
  }, [count, hyphens, uppercase]);

  // Generate on initial load
  useEffect(() => {
    generateUuids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle keyboard shortcut (Cmd/Ctrl + Enter to regenerate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        generateUuids();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generateUuids]);

  const totalPages = Math.max(1, Math.ceil(allUuids.length / pageSize));

  const visibleOutput = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allUuids.slice(start, start + pageSize).join("\n");
  }, [allUuids, currentPage, pageSize]);

  const fullOutput = useMemo(() => allUuids.join("\n"), [allUuids]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">UUID Generator</h1>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span
            className="text-xs text-slate-500 hidden lg:inline-block border px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
            title="Cmd/Ctrl + Enter"
          >
            ⌘↵ to Generate
          </span>
          <Button onClick={generateUuids}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate UUIDs
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/50 shadow-sm">
        <div className="flex flex-col gap-2">
          <Label htmlFor="count">Quantity</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="100000"
            className="w-32"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} />
          <Label htmlFor="hyphens">Include Hyphens (-)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
          <Label htmlFor="uppercase">Uppercase</Label>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border shadow-sm min-h-[400px]">
        <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Generated UUIDs (v4) - {allUuids.length.toLocaleString()} total
          </h2>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <CopyToClipboard text={fullOutput} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden border rounded-md">
          <CodeMirror
            value={visibleOutput}
            height="100%"
            className="h-full text-base"
            theme={editorTheme}
            readOnly
            editable={false}
          />
        </div>
      </div>
    </div>
  );
}
