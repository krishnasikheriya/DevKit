"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClearInputButtonProps {
  onClear: () => void;
  className?: string;
}

export function ClearInputButton({ onClear, className }: ClearInputButtonProps) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className={`h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors ${className}`}
      onClick={onClear}
      title="Clear input"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Clear</span>
    </Button>
  );
}
