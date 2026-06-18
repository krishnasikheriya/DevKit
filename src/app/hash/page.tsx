"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";

export default function HashGeneratorPage() {
  const [input, setInput] = useLocalStorage("devkit-hash-input", "");
  const [hashes, setHashes] = useState<Record<string, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-512": "",
  });
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  useEffect(() => {
    const generateHashes = async () => {
      if (!input) {
        setHashes({ "SHA-1": "", "SHA-256": "", "SHA-512": "" });
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const hashBufferSha1 = await crypto.subtle.digest("SHA-1", data);
      const hashBufferSha256 = await crypto.subtle.digest("SHA-256", data);
      const hashBufferSha512 = await crypto.subtle.digest("SHA-512", data);

      const toHex = (buffer: ArrayBuffer) => {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      };

      setHashes({
        "SHA-1": toHex(hashBufferSha1),
        "SHA-256": toHex(hashBufferSha256),
        "SHA-512": toHex(hashBufferSha512),
      });
    };

    generateHashes();
  }, [input]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hash Generator</h1>
      </div>

      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-[400px] max-h-[600px] rounded-lg border shadow-sm"
      >
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Input String
              </h2>
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
          <div className="h-full flex flex-col p-4 bg-slate-50 dark:bg-slate-900/50 overflow-auto space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Generated Hashes
            </h2>

            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {algo}
                  </span>
                  <CopyToClipboard text={hash} className="h-6 w-6" />
                </div>
                <div className="font-mono text-sm break-all p-3 bg-white dark:bg-[#1e1e1e] border rounded-md shadow-inner text-slate-700 dark:text-slate-300">
                  {hash || (
                    <span className="text-slate-400 italic">Enter text to generate hash...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
