"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useLocalStorage("devkit-json-input", "");
  const [outputJson, setOutputJson] = useLocalStorage("devkit-json-output", "");
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  
  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const handleFormat = () => {
    setError(null);
    
    if (!inputJson.trim()) {
      setOutputJson("");
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputJson(formatted);
    } catch (anyError: any) {
      setOutputJson("");
      setError(anyError.message || "Invalid JSON format");
    }
  };

  // Handle Shift+Enter shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputJson]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">JSON Formatter</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 hidden md:inline-block border px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Shift + Enter to Format</span>
          <Button onClick={handleFormat}>Format JSON</Button>
        </div>
      </div>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 rounded-lg border shadow-sm">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Input</h2>
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
            <h2 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Output</h2>
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