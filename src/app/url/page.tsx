"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";

export default function UrlEncoderPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [input, setInput] = useLocalStorage("devkit-url-input", "");
  const [output, setOutput] = useLocalStorage("devkit-url-output", "");
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const handleEncode = useCallback(() => {
    setError(null);
    if (!input) {
      setOutput("");
      return;
    }
    try {
      setOutput(encodeURIComponent(input));
    } catch (err) {
      setError("Encoding failed: " + (err as Error).message);
      setOutput("");
    }
  }, [input, setOutput]);

  const handleDecode = useCallback(() => {
    setError(null);
    if (!input) {
      setOutput("");
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
    } catch (err) {
      setError("Decoding failed: " + (err as Error).message);
      setOutput("");
    }
  }, [input, setOutput]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleEncode();
      } else if (!(e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleDecode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleEncode, handleDecode]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">URL Encoder / Decoder</h1>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span
            className="text-xs text-slate-500 hidden lg:inline-block border px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
            title="Cmd/Ctrl + Shift + Enter"
          >
            ⌘⇧↵ to Encode
          </span>
          <span
            className="text-xs text-slate-500 hidden lg:inline-block border px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
            title="Shift + Enter"
          >
            ⇧↵ to Decode
          </span>
          <Button onClick={handleEncode} variant="secondary">
            Encode
          </Button>
          <Button onClick={handleDecode}>Decode</Button>
        </div>
      </div>

      <ResizablePanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="min-h-[400px] max-h-[400px] rounded-lg border shadow-sm"
      >
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input</h2>
              <ClearInputButton onClear={() => setInput("")} />
            </div>
            <div className="flex-1 overflow-hidden border rounded-md">
              <CodeMirror
                value={input}
                height="100%"
                className="h-full text-base"
                theme={editorTheme}
                onChange={(value) => setInput(value)}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="bg-slate-200 dark:bg-slate-800" />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 space-y-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Output</h2>
              <CopyToClipboard text={output} />
            </div>
            {error ? (
              <div className="text-red-500 flex-1 p-4 border rounded-md font-mono bg-red-50 dark:bg-red-950/30 overflow-auto whitespace-pre-wrap shadow-inner">
                <span className="font-bold">Error:</span> {error}
              </div>
            ) : (
              <div className="flex-1 overflow-hidden border rounded-md">
                <CodeMirror
                  value={output}
                  height="100%"
                  className="h-full text-base"
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
