"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function JwtDecoderPage() {
  const [jwt, setJwt] = useLocalStorage("devkit-jwt-input", "");
  const [header, setHeader] = useLocalStorage("devkit-jwt-header", "");
  const [payload, setPayload] = useLocalStorage("devkit-jwt-payload", "");
  const [error, setError] = useState<string | null>(null);

  const handleDecode = () => {
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
    } catch (err: any) {
      setError(err.message || "Failed to decode JWT. Ensure it is a valid token.");
    }
  };

  // Handle Shift+Enter shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleDecode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jwt]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">JWT Decoder</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 hidden md:inline-block border px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Shift + Enter to Decode</span>
          <Button onClick={handleDecode}>Decode</Button>
        </div>
      </div>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2">
            <h2 className="text-sm font-semibold mb-2">Encoded Token</h2>
            <Textarea
              className="flex-1 font-mono resize-none"
              placeholder="Paste your JWT here..."
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 space-y-2">
            <h2 className="text-sm font-semibold mb-2">Decoded Header & Payload</h2>
            {error ? (
              <div className="text-red-500 p-2 border rounded-md">{error}</div>
            ) : (
              <>
                <Textarea
                  className="flex-1 font-mono resize-none bg-slate-50 dark:bg-slate-900"
                  readOnly
                  placeholder="Header..."
                  value={header}
                />
                <Textarea
                  className="flex-1 font-mono resize-none bg-slate-50 dark:bg-slate-900"
                  readOnly
                  placeholder="Payload..."
                  value={payload}
                />
              </>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}