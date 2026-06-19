"use client";

import { useState } from "react";
import { ExportImageButton } from "@/components/ui/export-image-button";
import { SnippetViewer } from "@/components/ui/snippet-viewer";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SnippetClientViewProps {
  content: string;
  language: string;
  title: string;
}

export function SnippetClientView({ content, language, title }: SnippetClientViewProps) {
  const [exportDark, setExportDark] = useState(true);
  const themeOverride = exportDark ? "dark" : "light";

  return (
    <>
      <div className="flex items-center gap-2">
        <ExportImageButton 
          content={content} 
          language={language} 
          title={title} 
          onThemeChange={setExportDark}
        />
        <CopyToClipboard text={content} />
      </div>

      <div className="w-full mt-6">
        {language === "markdown" ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm flex flex-col">
              <div className="flex items-center p-2 px-4 border-b bg-muted/30">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Raw Markdown
                </span>
              </div>
              <div className="flex-1 relative bg-background" id="snippet-export-container">
                <div className="absolute inset-0 p-4">
                  <SnippetViewer content={content} language={language} themeOverride={themeOverride} />
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm flex flex-col">
              <div className="flex items-center p-2 px-4 border-b bg-muted/30">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview
                </span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 border rounded-lg overflow-hidden bg-card shadow-sm min-h-[400px]">
            <div className="h-full w-full bg-background p-4" id="snippet-export-container">
              <SnippetViewer content={content} language={language} themeOverride={themeOverride} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
