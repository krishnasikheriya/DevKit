"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface ExportImageButtonProps {
  content: string;
  language: string;
  title: string;
}

export function ExportImageButton({ content, language, title }: ExportImageButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);

      // Build a temporary container with all the content as plain HTML.
      // This avoids CodeMirror's viewport virtualization which only renders
      // visible lines and was the root cause of content being cut off.
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.style.zIndex = "-9999";

      const lines = content.split("\n");
      const lineNumberWidth = String(lines.length).length;

      wrapper.innerHTML = `
        <div id="export-capture" style="
          padding: 48px;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          width: 800px;
        ">
          <div style="
            background: var(--background, #1e1e2e);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
          ">
            <div style="
              height: 48px;
              background: var(--muted, #2a2a3e);
              border-bottom: 1px solid var(--border, #3a3a4e);
              display: flex;
              align-items: center;
              padding: 0 16px;
              gap: 8px;
            ">
              <div style="width: 14px; height: 14px; border-radius: 50%; background: #ef4444;"></div>
              <div style="width: 14px; height: 14px; border-radius: 50%; background: #eab308;"></div>
              <div style="width: 14px; height: 14px; border-radius: 50%; background: #22c55e;"></div>
              <div style="
                margin-left: auto;
                font-size: 13px;
                font-weight: 500;
                color: var(--muted-foreground, #888);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding-right: 8px;
              ">${title} • ${language}</div>
            </div>
            <pre style="
              margin: 0;
              padding: 24px;
              font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
              font-size: 14px;
              line-height: 1.6;
              color: var(--foreground, #cdd6f4);
              white-space: pre-wrap;
              word-break: break-word;
              overflow: visible;
            ">${lines
              .map((line, i) => {
                const num = String(i + 1).padStart(lineNumberWidth, " ");
                const escapedLine = line
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
                return `<span style="color: var(--muted-foreground, #6c7086); user-select: none; display: inline-block; width: ${lineNumberWidth + 1}ch; text-align: right; margin-right: 1.5ch;">${num}</span>${escapedLine}`;
              })
              .join("\n")}</pre>
          </div>
        </div>
      `;

      document.body.appendChild(wrapper);

      // Wait for the browser to paint
      await new Promise(r => setTimeout(r, 100));

      const captureEl = document.getElementById("export-capture");
      if (!captureEl) throw new Error("Capture element not found");

      const dataUrl = await toPng(captureEl, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "transparent",
      });

      // Clean up
      document.body.removeChild(wrapper);

      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-")}-snippet.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      setIsExporting(false);
    }
  }, [content, language, title]);

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ImageIcon className="h-4 w-4" />
      )}
      Export Image
    </Button>
  );
}
