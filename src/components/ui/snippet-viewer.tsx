"use client";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";
import { useTheme } from "next-themes";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";

interface SnippetViewerProps {
  content: string;
  language: string;
  wrapLines?: boolean;
  themeOverride?: "dark" | "light";
}

export function SnippetViewer({ content, language, wrapLines = false, themeOverride }: SnippetViewerProps) {
  const { resolvedTheme } = useTheme();
  const effectiveTheme = themeOverride ? themeOverride : resolvedTheme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let extensions: any[] = [];

  if (language === "markdown") {
    extensions = [markdown({ base: markdownLanguage })];
  } else if (language === "sql") {
    extensions = [sql()];
  } else if (language === "json") {
    extensions = [json()];
  }

  if (wrapLines) {
    extensions.push(EditorView.lineWrapping);
    // Force CodeMirror to render all content by disabling scroll
    extensions.push(
      EditorView.theme({
        "&": { height: "auto", minHeight: "100%" },
        ".cm-scroller": { overflow: "visible !important" },
        ".cm-content": { paddingBottom: "0" }
      })
    );
  }

  return (
    <CodeMirror
      value={content}
      height={wrapLines ? "auto" : "100%"}
      className={wrapLines ? "text-base" : "h-full text-base"}
      theme={effectiveTheme === "dark" ? vscodeDark : vscodeLight}
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
