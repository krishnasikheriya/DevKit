"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { SnippetViewer } from "./snippet-viewer";

interface ExportImageButtonProps {
  content: string;
  language: string;
  title: string;
}

export function ExportImageButton({ content, language, title }: ExportImageButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const element = document.getElementById("hidden-export-container");
      if (!element) throw new Error("Target element not found");

      // We add a tiny delay to ensure fonts/syntax render
      await new Promise(r => setTimeout(r, 150));

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "transparent",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left"
        }
      });

      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, '-')}-snippet.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button 
        variant="secondary" 
        onClick={handleExport} 
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        Export Image
      </Button>

      <div className="absolute left-[-9999px] top-[-9999px]">
        <div 
          id="hidden-export-container" 
          className="p-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 w-[800px]"
        >
          <div className="bg-background rounded-xl shadow-2xl overflow-hidden border border-white/20">
            <div className="h-12 bg-muted/80 backdrop-blur border-b flex items-center px-4 gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm" />
              <div className="ml-auto text-sm font-medium text-muted-foreground uppercase tracking-wider pr-2">
                {title} • {language}
              </div>
            </div>
            <div className="p-6">
              <SnippetViewer 
                content={content} 
                language={language} 
                wrapLines={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
