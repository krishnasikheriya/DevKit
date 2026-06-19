"use client";

import { useState, useEffect, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";
import { ShareSnippet } from "@/components/ui/share-snippet";

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useLocalStorage("devkit-json-input", "");
  const [outputJson, setOutputJson] = useLocalStorage("devkit-json-output", "");
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const handleFormat = useCallback(() => {
    try {
      if (!inputJson.trim()) {
        setOutputJson("");
        setError(null);
        return;
      }
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [inputJson, setOutputJson]);

  const handleMinify = useCallback(() => {
    try {
      if (!inputJson.trim()) {
        setOutputJson("");
        setError(null);
        return;
      }
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [inputJson, setOutputJson]);

  // Handle keyboard shortcut for formatting (Cmd/Ctrl + Shift + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFormat]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">JSON Formatter</h1>
        <div className="flex items-center gap-2">
          <ShareSnippet content={outputJson} language="json" defaultTitle="Formatted JSON Data" />
          <Button onClick={handleFormat} variant="default">
            Format
          </Button>
          <Button onClick={handleMinify} variant="secondary">
            Minify
          </Button>
        </div>
      </div>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 rounded-lg border shadow-sm">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input</h2>
              <ClearInputButton onClear={() => setInputJson("")} />
            </div>
            <div className="flex-1 overflow-hidden border rounded-md">
              <CodeMirror
                value={inputJson}
                height="100%"
                className="h-full text-base"
                extensions={[json()]}
                theme={editorTheme}
                onChange={(value) => setInputJson(value)}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-slate-200 dark:bg-slate-800" />

        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Output</h2>
              <CopyToClipboard text={outputJson} />
            </div>
            {error ? (
              <div className="text-red-500 flex-1 p-4 border rounded-md font-mono bg-red-50 dark:bg-red-950/30 overflow-auto whitespace-pre-wrap shadow-inner">
                <span className="font-bold">Error:</span> {error}
              </div>
            ) : (
              <div className="flex-1 overflow-hidden border rounded-md">
                <CodeMirror
                  value={outputJson}
                  height="100%"
                  className="h-full text-base"
                  extensions={[json()]}
                  theme={editorTheme}
                  readOnly
                  editable={false}
                />
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
