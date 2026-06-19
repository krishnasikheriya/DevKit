"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";
import { Type } from "lucide-react";
import JsonToTS from "json-to-ts";

export default function JsonToTsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [inputJson, setInputJson] = useLocalStorage("devkit-json-ts-input", '{\n  "id": 1,\n  "name": "DevKit",\n  "isAwesome": true\n}');
  const [outputTs, setOutputTs] = useLocalStorage("devkit-json-ts-output", "");
  const [rootObjectName, setRootObjectName] = useLocalStorage("devkit-json-ts-root", "RootObject");
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const handleConvert = useCallback(() => {
    try {
      if (!inputJson.trim()) {
        setOutputTs("");
        setError(null);
        return;
      }

      const parsedJson = JSON.parse(inputJson);
      
      const interfaces = JsonToTS(parsedJson, {
        rootName: rootObjectName || "RootObject"
      });

      setOutputTs(interfaces.join("\n\n"));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [inputJson, rootObjectName, setOutputTs]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleConvert();
  }, [handleConvert]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Type className="h-6 w-6 text-primary" />
          JSON to TypeScript
        </h1>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Root Name:</span>
            <input 
              type="text" 
              value={rootObjectName}
              onChange={(e) => setRootObjectName(e.target.value)}
              className="px-3 py-1.5 bg-background border rounded-md text-sm w-40"
              placeholder="RootObject"
            />
          </div>
          <Button onClick={handleConvert}>Convert</Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <ResizablePanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="flex-1 rounded-lg border shadow-sm"
      >
        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Input JSON
            </span>
            <ClearInputButton onClear={() => setInputJson("")} />
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeMirror
              value={inputJson}
              height="100%"
              extensions={[json()]}
              onChange={(value) => setInputJson(value)}
              theme={editorTheme}
              className="absolute inset-0 text-base"
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
              }}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              TypeScript Interfaces
            </span>
            <CopyToClipboard text={outputTs} />
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeMirror
              value={outputTs}
              height="100%"
              extensions={[javascript({ typescript: true })]}
              theme={editorTheme}
              editable={false}
              className="absolute inset-0 text-base"
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: false,
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
