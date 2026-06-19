"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface ExportImageButtonProps {
  targetId: string;
  fileName?: string;
}

export function ExportImageButton({ targetId, fileName = "snippet.png" }: ExportImageButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const element = document.getElementById(targetId);
      if (!element) throw new Error("Target element not found");

      // We add a tiny delay to ensure any fonts or syntax highlighting have rendered
      await new Promise(r => setTimeout(r, 100));

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
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="secondary" 
      onClick={handleExport} 
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      Export Image
    </Button>
  );
}
