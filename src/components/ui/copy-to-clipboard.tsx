"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyToClipboardProps {
  text: string;
  className?: string;
  disabled?: boolean;
}

export function CopyToClipboard({ text, className, disabled }: CopyToClipboardProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!text) {
      toast.error("Nothing to copy!");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      toast.success("Copied to clipboard!");

      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className={`h-8 w-8 ${className}`}
      onClick={copyToClipboard}
      title="Copy to clipboard"
      disabled={disabled}
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100" />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
}
