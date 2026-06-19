"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";
import { Type } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function TextCaseConverterPage() {
  const [input, setInput] = useState<string>("Hello world! This is a test string.");

  // Case conversion utilities
  const toWords = (str: string) =>
    str.match(
      /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g
    ) || [];

  const toCamelCase = (str: string) => {
    const words = toWords(str);
    return words
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  };

  const toPascalCase = (str: string) => {
    const words = toWords(str);
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
  };

  const toSnakeCase = (str: string) =>
    toWords(str)
      .map((w) => w.toLowerCase())
      .join("_");

  const toKebabCase = (str: string) =>
    toWords(str)
      .map((w) => w.toLowerCase())
      .join("-");

  const toConstantCase = (str: string) =>
    toWords(str)
      .map((w) => w.toUpperCase())
      .join("_");

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toSentenceCase = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const toAlternatingCase = (str: string) => {
    return str
      .split("")
      .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join("");
  };

  const cases = [
    { label: "lower case", value: input.toLowerCase() },
    { label: "UPPER CASE", value: input.toUpperCase() },
    { label: "camelCase", value: toCamelCase(input) },
    { label: "PascalCase", value: toPascalCase(input) },
    { label: "snake_case", value: toSnakeCase(input) },
    { label: "kebab-case", value: toKebabCase(input) },
    { label: "CONSTANT_CASE", value: toConstantCase(input) },
    { label: "Title Case", value: toTitleCase(input) },
    { label: "Sentence case", value: toSentenceCase(input) },
    { label: "aLtErNaTiNg CaSe", value: toAlternatingCase(input) },
  ];

  return (
    <div className="h-full flex flex-col p-4 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Type className="h-6 w-6 text-primary" />
          Text Case Converter
        </h1>
      </div>

      <div className="flex flex-col space-y-6">
        {/* Input Textarea */}
        <div className="p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="textInput" className="text-base font-semibold">
              Enter your text
            </Label>
            <ClearInputButton onClear={() => setInput("")} />
          </div>
          <Textarea
            id="textInput"
            placeholder="Type or paste your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] font-mono text-base resize-y"
          />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <CaseCard key={c.label} label={c.label} value={c.value} hasInput={!!input.trim()} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CaseCard({ label, value, hasInput }: { label: string; value: string; hasInput: boolean }) {
  return (
    <div className="flex flex-col p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 group space-y-2 h-[120px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyToClipboard text={value} disabled={!hasInput} />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <span className={`font-mono text-sm ${!hasInput ? "text-muted-foreground italic" : ""}`}>
          {hasInput ? value : "---"}
        </span>
      </div>
    </div>
  );
}
