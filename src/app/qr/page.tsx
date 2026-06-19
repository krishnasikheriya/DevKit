"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { QrCode, Download } from "lucide-react";
import { toast } from "sonner";
import { ClearInputButton } from "@/components/ui/clear-input";

export default function QrGeneratorPage() {
  const [text, setText] = useLocalStorage("devkit-qr-text", "https://devkit.com");
  const [fgColor, setFgColor] = useLocalStorage("devkit-qr-fg", "#000000");
  const [bgColor, setBgColor] = useLocalStorage("devkit-qr-bg", "#ffffff");
  const [size, setSize] = useLocalStorage("devkit-qr-size", "256");

  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;

    try {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const parsedSize = parseInt(size, 10) || 256;
      canvas.width = parsedSize;
      canvas.height = parsedSize;

      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = "qrcode.png";
          downloadLink.href = pngFile;
          downloadLink.click();
          toast.success("QR Code downloaded successfully!");
        }
      };

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch {
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <QrCode className="h-6 w-6 text-primary" />
          QR Code Generator
        </h1>
        <Button onClick={downloadQR} className="gap-2">
          <Download className="h-4 w-4" />
          Download PNG
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 bg-card border rounded-lg p-6 shadow-sm">
          <div className="space-y-2 relative">
            <Label htmlFor="text">Content (URL, text, etc.)</Label>
            <div className="relative">
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
                className="pr-10"
              />
              <div className="absolute right-1 top-1">
                <ClearInputButton onClear={() => setText("")} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Customization
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fgColor">Foreground Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="fgColor"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="bgColor"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Export Size (px)</Label>
              <Input
                id="size"
                type="number"
                min="128"
                max="2048"
                step="64"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-muted/30 border rounded-lg p-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {/* Grid pattern background for preview area */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl z-10 transition-transform hover:scale-105 duration-300">
            <QRCodeSVG
              value={text || " "}
              size={Math.min(parseInt(size, 10) || 256, 300)}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              includeMargin={false}
              ref={qrRef}
              className="max-w-full h-auto"
            />
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground z-10 bg-background/80 px-4 py-2 rounded-full backdrop-blur">
            Live Preview (Export size: {size}x{size}px)
          </div>
        </div>
      </div>
    </div>
  );
}
