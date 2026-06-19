"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Clock } from "lucide-react";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { ClearInputButton } from "@/components/ui/clear-input";

export default function CronPage() {
  const [expression, setExpression] = useLocalStorage("devkit-cron", "*/5 * * * *");
  const [humanReadable, setHumanReadable] = useState<string>("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseCron = useCallback(() => {
    try {
      if (!expression.trim()) {
        setHumanReadable("");
        setNextRuns([]);
        setError(null);
        return;
      }

      // 1. Get Human Readable Description
      const readable = cronstrue.toString(expression, { throwExceptionOnParseError: true });
      setHumanReadable(readable);

      // 2. Get Next 5 Runs
      const interval = CronExpressionParser.parse(expression);
      const runs: string[] = [];
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toString());
      }
      setNextRuns(runs);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Invalid cron expression");
      setHumanReadable("");
      setNextRuns([]);
    }
  }, [expression]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    parseCron();
  }, [parseCron]);

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Crontab Explainer
        </h1>
        <div className="text-sm text-muted-foreground">
          Generate and decode cron expressions
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto space-y-6">
        
        {/* Input Section */}
        <div className="p-6 bg-card border rounded-lg shadow-sm space-y-4 relative">
          <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cron Expression
          </label>
          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full text-2xl font-mono p-4 bg-muted/50 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="* * * * *"
              spellCheck="false"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <ClearInputButton onClear={() => setExpression("")} />
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground font-mono px-2">
            <span>minute</span>
            <span>hour</span>
            <span>day (month)</span>
            <span>month</span>
            <span>day (week)</span>
          </div>
        </div>

        {/* Error Section */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm font-medium">
            Error: {error}
          </div>
        )}

        {/* Output Section */}
        {!error && humanReadable && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 bg-card border rounded-lg shadow-sm space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h2>
              <div className="text-2xl font-medium text-foreground capitalize leading-snug">
                &quot;{humanReadable}&quot;
              </div>
            </div>

            <div className="p-6 bg-card border rounded-lg shadow-sm space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Next Scheduled Runs
              </h2>
              <ul className="space-y-2">
                {nextRuns.map((run, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-mono p-2 bg-muted/30 rounded border border-border/50">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    <span>{run}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
