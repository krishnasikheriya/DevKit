"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";
import { useTheme } from "next-themes";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";

interface SnippetViewerProps {
  content: string;
  language: string;
}

export function SnippetViewer({ content, language }: SnippetViewerProps) {
  const { resolvedTheme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extensions: any[] = [];

  if (language === "markdown") {
    extensions = [markdown({ base: markdownLanguage })];
  } else if (language === "sql") {
    extensions = [sql()];
  } else if (language === "json") {
    extensions = [json()];
  }

  return (
    <CodeMirror
      value={content}
      height="100%"
      className="h-full text-base"
      theme={resolvedTheme === "dark" ? vscodeDark : vscodeLight}
      extensions={extensions}
      editable={false}
      readOnly={true}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: false,
      }}
    />
  );
}
