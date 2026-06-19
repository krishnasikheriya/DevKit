/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";
import { Palette } from "lucide-react";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import cmykPlugin from "colord/plugins/cmyk";

extend([namesPlugin, cmykPlugin]);

export default function ColorConverterPage() {
  const [colorInput, setColorInput] = useState<string>("#4F46E5");

  // Parsed outputs
  const [isValid, setIsValid] = useState(true);
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [cmyk, setCmyk] = useState("");
  const [colorName, setColorName] = useState("");

  useEffect(() => {
    if (!colorInput.trim()) {
      setIsValid(false);
      return;
    }

    const c = colord(colorInput);
    if (c.isValid()) {
      setIsValid(true);
      setHex(c.toHex());
      setRgb(c.toRgbString());
      setHsl(c.toHslString());
      setCmyk(c.toCmykString());

      const name = c.toName({ closest: true });
      setColorName(name ? name.charAt(0).toUpperCase() + name.slice(1) : "Unknown");
    } else {
      setIsValid(false);
    }
  }, [colorInput]);

  return (
    <div className="h-full flex flex-col p-4 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          Color Converter
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input and Preview */}
        <div className="flex flex-col space-y-4 lg:col-span-1">
          <div className="p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="colorInput" className="text-base font-semibold">
                Enter a Color
              </Label>
              <ClearInputButton onClear={() => setColorInput("")} />
            </div>
            <Input
              id="colorInput"
              placeholder="HEX, RGB, HSL, or Name (e.g. #fff, red)"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="font-mono text-base"
            />
            {!isValid && colorInput && (
              <p className="text-destructive text-sm font-medium">Invalid color format</p>
            )}
          </div>

          <div
            className="w-full h-48 rounded-lg shadow-sm border border-border/40 transition-colors duration-300 flex flex-col items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: isValid ? hex : "transparent" }}
          >
            {/* Checkerboard background for transparency preview */}
            <div
              className="absolute inset-0 z-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            />

            <div
              className="absolute inset-0 z-10 transition-colors duration-300"
              style={{ backgroundColor: isValid ? hex : "transparent" }}
            />

            {isValid && (
              <div className="z-20 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-foreground font-semibold flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: hex }}
                />
                {colorName}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Values */}
        <div className="flex flex-col space-y-4 lg:col-span-2">
          <ColorValueCard label="HEX" value={hex} isValid={isValid} />
          <ColorValueCard label="RGB" value={rgb} isValid={isValid} />
          <ColorValueCard label="HSL" value={hsl} isValid={isValid} />
          <ColorValueCard label="CMYK" value={cmyk} isValid={isValid} />
        </div>
      </div>
    </div>
  );
}

function ColorValueCard({
  label,
  value,
  isValid,
}: {
  label: string;
  value: string;
  isValid: boolean;
}) {
  return (
    <div className="p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between group">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </span>
        <span
          className={`font-mono text-lg font-medium ${!isValid && "text-muted-foreground italic"}`}
        >
          {isValid ? value : "---"}
        </span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyToClipboard text={value} disabled={!isValid} />
      </div>
    </div>
  );
}
