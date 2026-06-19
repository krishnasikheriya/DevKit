"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearInputButton } from "@/components/ui/clear-input";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { ShareSnippet } from "@/components/ui/share-snippet";

const DEFAULT_MARKDOWN = `# Markdown Previewer

Welcome to the **Markdown Previewer**!

## Features
- Real-time preview
- GitHub Flavored Markdown (GFM) support
- Syntax highlighting
- Tables, task lists, and more

### Code Example
\`\`\`javascript
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

### Task List
- [x] Write code
- [x] Test code
- [ ] Ship it!

| Feature | Support |
|---------|---------|
| Tables  | Yes     |
| GFM     | Yes     |
`;

export default function MarkdownPreviewerPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [content, setContent] = useLocalStorage("devkit-markdown", DEFAULT_MARKDOWN);
  const { resolvedTheme } = useTheme();
  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const downloadHtml = () => {
    // Basic wrapper to make it look decent when downloaded
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    code { font-family: monospace; background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
    pre code { background: none; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f4f4f4; }
    blockquote { border-left: 4px solid #ddd; padding-left: 1rem; margin-left: 0; color: #666; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  \${document.getElementById('markdown-preview')?.innerHTML || ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded HTML export!");
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Markdown Previewer
        </h1>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <ShareSnippet content={content} language="markdown" defaultTitle="Markdown Document" />
          <Button onClick={downloadHtml} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export HTML
          </Button>
        </div>
      </div>

      <ResizablePanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="flex-1 rounded-lg border"
      >
        {/* Editor Panel */}
        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Markdown Input
            </span>
            <ClearInputButton onClear={() => setContent("")} />
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeMirror
              value={content}
              height="100%"
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
              onChange={(value) => setContent(value)}
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

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Live Preview
            </span>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-white dark:bg-slate-950">
            <div
              id="markdown-preview"
              className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-slate-100 dark:prose-pre:bg-slate-900 prose-pre:text-slate-900 dark:prose-pre:text-slate-100 prose-headings:font-bold"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
