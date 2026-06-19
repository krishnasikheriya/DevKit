"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, Sun, Moon } from "lucide-react";
import { toPng } from "html-to-image";
import { codeToHtml } from "shiki";

interface ExportImageButtonProps {
  content: string;
  language: string;
  title: string;
}

const LANG_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  rust: "rust",
  go: "go",
  php: "php",
  sql: "sql",
  json: "json",
  html: "html",
  css: "css",
  markdown: "markdown",
  plaintext: "text",
};

export function ExportImageButton({ content, language, title }: ExportImageButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportDark, setExportDark] = useState(true);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);

      const shikiLang = LANG_MAP[language] || "text";
      const highlightedHtml = await codeToHtml(content, {
        lang: shikiLang,
        theme: exportDark ? "one-dark-pro" : "github-light",
      });
      const titleBarBg = exportDark ? "#282c34" : "#f6f8fa";
      const titleBarBorder = exportDark ? "#3e4451" : "#d1d5db";
      const titleBarText = exportDark ? "#636d83" : "#6b7280";

      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.style.zIndex = "-9999";

      wrapper.innerHTML = `
        <div id="export-capture" style="
          padding: 48px;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          width: 800px;
        ">
          <div style="
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
          ">
            <div style="
              height: 48px;
              background: ${titleBarBg};
              border-bottom: 1px solid ${titleBarBorder};
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
                color: ${titleBarText};
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding-right: 8px;
              ">${title} • ${language}</div>
            </div>
            <div class="shiki-export-wrapper" style="padding: 0;">
              ${highlightedHtml}
            </div>
          </div>
        </div>
      `;

      const preEl = wrapper.querySelector("pre");
      if (preEl) {
        preEl.style.margin = "0";
        preEl.style.padding = "24px";
        preEl.style.fontSize = "14px";
        preEl.style.lineHeight = "1.6";
        preEl.style.whiteSpace = "pre-wrap";
        preEl.style.wordBreak = "break-word";
        preEl.style.overflow = "visible";
        preEl.style.borderRadius = "0";
      }

      document.body.appendChild(wrapper);
      await new Promise(r => setTimeout(r, 100));

      const captureEl = document.getElementById("export-capture");
      if (!captureEl) throw new Error("Capture element not found");

      const dataUrl = await toPng(captureEl, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "transparent",
      });

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
  }, [content, language, title, exportDark]);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExportDark((d) => !d)}
        className="h-9 w-9 rounded-md"
        title={exportDark ? "Export as light theme" : "Export as dark theme"}
      >
        {exportDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
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
    </div>
  );
}
