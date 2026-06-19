"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import MergeView from "react-codemirror-merge";
import { EditorView } from "codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { ClearInputButton } from "@/components/ui/clear-input";
import { GitCompare } from "lucide-react";

export default function DiffViewerPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [originalText, setOriginalText] = useLocalStorage(
    "devkit-diff-original",
    "function helloWorld() {\n  console.log('Hello, World!');\n}"
  );
  const [modifiedText, setModifiedText] = useLocalStorage(
    "devkit-diff-modified",
    "function helloWorld() {\n  console.log('Hello, Universe!');\n}"
  );

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GitCompare className="h-6 w-6 text-primary" />
          Text Diff Viewer
        </h1>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-sm text-muted-foreground">
          Compare two text blocks or code snippets.
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
          <div className="flex flex-1 justify-between items-center pr-4 border-r">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Original Text
            </span>
            <ClearInputButton onClear={() => setOriginalText("")} />
          </div>
          <div className="flex flex-1 justify-between items-center pl-4">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Modified Text
            </span>
            <ClearInputButton onClear={() => setModifiedText("")} />
          </div>
        </div>

        <div className="flex-1 overflow-auto relative">
          <div className="absolute inset-0">
            <MergeView
              orientation={isMobile ? "b-a" : "a-b"}
              theme={isDark ? vscodeDark : vscodeLight}
              className="h-full w-full text-base"
              style={{ height: '100%' }}
            >
              <MergeView.Original
                value={originalText}
                onChange={(value) => setOriginalText(value)}
                extensions={[EditorView.lineWrapping]}
              />
              <MergeView.Modified
                value={modifiedText}
                onChange={(value) => setModifiedText(value)}
                extensions={[EditorView.lineWrapping]}
              />
            </MergeView>
          </div>
        </div>
      </div>
    </div>
  );
}
