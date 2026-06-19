"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { Input } from "@/components/ui/input";
import { ClearInputButton } from "@/components/ui/clear-input";

export default function JwtDecoderPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [jwt, setJwt] = useLocalStorage("devkit-jwt-input", "");
  const [header, setHeader] = useLocalStorage("devkit-jwt-header", "");
  const [payload, setPayload] = useLocalStorage("devkit-jwt-payload", "");
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const handleDecode = useCallback(() => {
    setError(null);
    setHeader("");
    setPayload("");

    if (!jwt.trim()) return;

    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. A valid token must have 3 parts separated by dots.");
      }

      // Helper function to decode Base64Url and parse safely
      const decodeBase64Url = (str: string) => {
        // Convert Base64Url to Base64
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

        // Pad string
        while (base64.length % 4) {
          base64 += "=";
        }

        // Decode to UTF-8 string safely
        const decodedStr = decodeURIComponent(escape(atob(base64)));
        return JSON.stringify(JSON.parse(decodedStr), null, 2);
      };

      setHeader(decodeBase64Url(parts[0]));
      setPayload(decodeBase64Url(parts[1]));
    } catch (err) {
      setError((err as Error).message || "Failed to decode JWT. Ensure it is a valid token.");
    }
  }, [jwt, setHeader, setPayload]);

  // Handle Shift+Enter shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleDecode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDecode]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">JWT Decoder</h1>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <span className="text-xs text-slate-500 hidden md:inline-block border px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
            Shift + Enter to Decode
          </span>
          <Button onClick={handleDecode}>Decode</Button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Encoded Token
          </h2>
          <ClearInputButton onClear={() => setJwt("")} />
        </div>
        <Input
          className="font-mono text-sm"
          placeholder="Paste your JWT here..."
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>

      <ResizablePanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="flex-1 rounded-lg border shadow-sm"
      >
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Header{" "}
                <span className="text-xs font-normal text-slate-400">(Algorithm & Type)</span>
              </h2>
              <CopyToClipboard text={header} />
            </div>
            <div className="flex-1 overflow-hidden border rounded-md">
              <CodeMirror
                value={header}
                height="100%"
                className="h-full text-base"
                extensions={[json()]}
                theme={editorTheme}
                readOnly
                editable={false}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-slate-200 dark:bg-slate-800" />

        <ResizablePanel defaultSize={70} minSize={20}>
          <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Payload <span className="text-xs font-normal text-slate-400">(Data)</span>
              </h2>
              <CopyToClipboard text={payload} />
            </div>
            <div className="flex-1 overflow-hidden border rounded-md">
              <CodeMirror
                value={payload}
                height="100%"
                className="h-full text-base"
                extensions={[json()]}
                theme={editorTheme}
                readOnly
                editable={false}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
