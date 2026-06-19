"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";
import { Database } from "lucide-react";
import { format, SqlLanguage } from "sql-formatter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShareSnippet } from "@/components/ui/share-snippet";

export default function SqlFormatterPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [inputSql, setInputSql] = useLocalStorage("devkit-sql-input", "");
  const [outputSql, setOutputSql] = useLocalStorage("devkit-sql-output", "");
  const [dialect, setDialect] = useLocalStorage("devkit-sql-dialect", "postgresql");
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "dark" ? vscodeDark : vscodeLight;

  const handleFormat = useCallback(() => {
    try {
      if (!inputSql.trim()) {
        setOutputSql("");
        setError(null);
        return;
      }

      const formatted = format(inputSql, {
        language: dialect as SqlLanguage,
        tabWidth: 2,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      });

      setOutputSql(formatted);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [inputSql, dialect, setOutputSql]);

  // Handle keyboard shortcut for formatting (Cmd/Ctrl + Shift + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFormat]);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          SQL Formatter
        </h1>
        <div className="flex items-center gap-2">
          <Select value={dialect} onValueChange={(val) => val && setDialect(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Dialect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="postgresql">PostgreSQL</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="mariadb">MariaDB</SelectItem>
              <SelectItem value="sqlite">SQLite</SelectItem>
              <SelectItem value="sqlserver">SQL Server</SelectItem>
              <SelectItem value="plsql">PL/SQL</SelectItem>
            </SelectContent>
          </Select>
          <ShareSnippet content={outputSql} language="sql" defaultTitle="Formatted SQL Query" />
          <Button onClick={handleFormat}>Format SQL</Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <ResizablePanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="flex-1 rounded-lg border"
      >
        {/* Input Panel */}
        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Input SQL
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2 hidden sm:inline-block">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px] font-mono">
                  ⌘⇧↵
                </kbd>{" "}
                to format
              </span>
              <ClearInputButton onClear={() => setInputSql("")} />
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeMirror
              value={inputSql}
              height="100%"
              extensions={[sql()]}
              onChange={(value) => setInputSql(value)}
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

        {/* Output Panel */}
        <ResizablePanel defaultSize={50} className="flex flex-col bg-card">
          <div className="flex items-center justify-between p-2 px-4 border-b bg-muted/30">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Formatted SQL
            </span>
            <CopyToClipboard text={outputSql} />
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeMirror
              value={outputSql}
              height="100%"
              extensions={[sql()]}
              theme={editorTheme}
              editable={false}
              className="absolute inset-0 text-base"
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
