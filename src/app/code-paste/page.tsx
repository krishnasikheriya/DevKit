"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Code2 } from "lucide-react";
import { ClearInputButton } from "@/components/ui/clear-input";
import { ShareSnippet } from "@/components/ui/share-snippet";
import { ExportImageButton } from "@/components/ui/export-image-button";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C / C++" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "php", label: "PHP" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
];

function getLanguageExtension(lang: string) {
  switch (lang) {
    case "javascript": return [javascript()];
    case "typescript": return [javascript({ typescript: true })];
    case "python": return [python()];
    case "java": return [java()];
    case "cpp": return [cpp()];
    case "rust": return [rust()];
    case "go": return [go()];
    case "php": return [php()];
    case "sql": return [sql()];
    case "json": return [json()];
    case "html": return [html()];
    case "css": return [css()];
    case "markdown": return [markdown({ base: markdownLanguage })];
    default: return [];
  }
}

const DEFAULT_CODE = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i));
}`;

export default function CodePastePage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [code, setCode] = useLocalStorage("devkit-code-paste", DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useLocalStorage("devkit-code-paste-title", "My Code Snippet");
  const { resolvedTheme } = useTheme();
  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Code Paste
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Paste code, share via link, and export as image
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <ExportImageButton content={code} language={language} title={title} />
          <ShareSnippet content={code} language={language} defaultTitle={title} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="paste-title" className="text-sm font-medium text-muted-foreground">
            Title
          </label>
          <input
            id="paste-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 px-3 rounded-md border bg-background text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Snippet title"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="paste-lang" className="text-sm font-medium text-muted-foreground">
            Language
          </label>
          <select
            id="paste-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-8 px-3 rounded-md border bg-background text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-muted-foreground ml-auto">
          {lineCount} lines · {charCount} chars
        </div>
      </div>

      <ResizablePanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="flex-1 rounded-lg border"
      >
        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Code
            </span>
            <ClearInputButton onClear={() => setCode("")} />
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeMirror
              value={code}
              height="100%"
              extensions={getLanguageExtension(language)}
              onChange={(value) => setCode(value)}
              theme={editorTheme}
              className="absolute inset-0 text-base"
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
              }}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Preview
            </span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeMirror
              value={code}
              height="100%"
              extensions={getLanguageExtension(language)}
              theme={editorTheme}
              className="absolute inset-0 text-base"
              editable={false}
              readOnly={true}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: false,
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
