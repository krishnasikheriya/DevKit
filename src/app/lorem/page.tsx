/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { AlignLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

function generateLorem(type: "words" | "sentences" | "paragraphs", count: number): string {
  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 8) + 5; // 5 to 12 words per sentence
    const sentence = [];
    for (let i = 0; i < wordCount; i++) {
      sentence.push(getRandomWord());
    }
    const str = sentence.join(" ");
    return str.charAt(0).toUpperCase() + str.slice(1) + ".";
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3 to 6 sentences per paragraph
    const paragraph = [];
    for (let i = 0; i < sentenceCount; i++) {
      paragraph.push(generateSentence());
    }
    return paragraph.join(" ");
  };

  const result = [];

  if (type === "words") {
    for (let i = 0; i < count; i++) {
      result.push(getRandomWord());
    }
    return result.join(" ");
  }

  if (type === "sentences") {
    for (let i = 0; i < count; i++) {
      result.push(generateSentence());
    }
    return result.join(" ");
  }

  if (type === "paragraphs") {
    for (let i = 0; i < count; i++) {
      result.push(generateParagraph());
    }
    return result.join("\n\n");
  }

  return "";
}

export default function LoremIpsumPage() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState<number>(3);
  const [output, setOutput] = useState<string>("");

  const handleGenerate = () => {
    // Enforce limits to prevent massive lockups
    let safeCount = count;
    if (type === "paragraphs" && count > 100) safeCount = 100;
    if (type === "sentences" && count > 1000) safeCount = 1000;
    if (type === "words" && count > 10000) safeCount = 10000;
    if (safeCount < 1) safeCount = 1;

    setOutput(generateLorem(type, safeCount));
  };

  // Generate on initial load and when dependencies change
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, count]);

  return (
    <div className="h-full flex flex-col p-4 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlignLeft className="h-6 w-6 text-primary" />
          Lorem Ipsum Generator
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column: Controls */}
        <div className="flex flex-col space-y-4 lg:col-span-1">
          <div className="p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Type</Label>
              <div className="flex flex-col gap-2">
                {(["paragraphs", "sentences", "words"] as const).map((t) => (
                  <Button
                    key={t}
                    variant={type === t ? "default" : "outline"}
                    className={`justify-start ${type === t ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary ring-1 ring-primary/30 border-transparent" : ""}`}
                    onClick={() => setType(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="countInput" className="text-base font-semibold">
                Count
              </Label>
              <Input
                id="countInput"
                type="number"
                min="1"
                max={type === "paragraphs" ? 100 : type === "sentences" ? 1000 : 10000}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="font-mono text-base"
              />
            </div>

            <Button onClick={handleGenerate} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col lg:col-span-2 p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm h-full max-h-[70vh]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Output
            </h2>
            <CopyToClipboard text={output} />
          </div>

          <div className="flex-1 overflow-auto bg-background/50 rounded-md border border-border/40 p-4">
            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">{output}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
