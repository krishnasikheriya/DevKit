"use client";

import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Base64Page() {
  const [input, setInput] = useLocalStorage("devkit-base64-input", "");
  const [output, setOutput] = useLocalStorage("devkit-base64-output", "");
  const [error, setError] = useState<string | null>(null);

  const handleEncode = () => {
    setError(null);
    if (!input) {
      setOutput("");
      return;
    }
    try {
      // Encode string to UTF-8, then to Base64
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err: any) {
      setError("Encoding failed: " + err.message);
      setOutput("");
    }
  };

  const handleDecode = () => {
    setError(null);
    if (!input) {
      setOutput("");
      return;
    }
    try {
      // Decode Base64 to UTF-8 string
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (err: any) {
      setError("Invalid Base64 string: " + err.message);
      setOutput("");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleEncode();
      } else if (!e.metaKey && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleDecode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Base64 Encoder / Decoder</h1>
        <div className="space-x-2">
          <Button onClick={handleEncode} variant="secondary">Encode</Button>
          <Button onClick={handleDecode}>Decode</Button>
        </div>
      </div>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2">
            <h2 className="text-sm font-semibold mb-2">Input</h2>
            <Textarea
              className="flex-1 font-mono resize-none"
              placeholder="Enter text or Base64 string..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col p-2 space-y-2">
            <h2 className="text-sm font-semibold mb-2">Output</h2>
            {error ? (
              <div className="text-red-500 flex-1 p-2 border rounded-md">{error}</div>
            ) : (
              <Textarea
                className="flex-1 font-mono resize-none bg-slate-50 dark:bg-slate-900"
                readOnly
                value={output}
              />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}