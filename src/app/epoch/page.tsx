/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { ClearInputButton } from "@/components/ui/clear-input";
import { Clock } from "lucide-react";

export default function EpochConverterPage() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));

  const [epochInput, setEpochInput] = useState<string>("");
  const [epochResult, setEpochResult] = useState<Date | null>(null);

  const [dateInput, setDateInput] = useState<string>("");
  const [dateResult, setDateResult] = useState<number | null>(null);

  // Update current epoch every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle epoch input parsing
  useEffect(() => {
    if (!epochInput.trim()) {
      setEpochResult(null);
      return;
    }

    // Check if it's seconds or milliseconds
    const num = Number(epochInput);
    if (isNaN(num)) {
      setEpochResult(null);
      return;
    }

    // Heuristic: If it's more than 10^12, it's likely milliseconds.
    // Example: 2001-09-09 in ms is 1,000,000,000,000
    const isMs = epochInput.length >= 13;
    const date = new Date(isMs ? num : num * 1000);

    // Check for invalid date
    if (isNaN(date.getTime())) {
      setEpochResult(null);
    } else {
      setEpochResult(date);
    }
  }, [epochInput]);

  // Handle date input parsing
  useEffect(() => {
    if (!dateInput.trim()) {
      setDateResult(null);
      return;
    }
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      setDateResult(Math.floor(date.getTime() / 1000));
    } else {
      setDateResult(null);
    }
  }, [dateInput]);

  return (
    <div className="h-full flex flex-col p-4 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Epoch / Unix Timestamp Converter
        </h1>
      </div>

      {/* Current Epoch Card */}
      <div className="p-6 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Current Unix Epoch
          </h2>
          <div className="text-3xl font-mono font-bold text-primary">{currentEpoch}</div>
        </div>
        <div className="flex gap-2">
          <CopyToClipboard text={currentEpoch.toString()} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Epoch to Date */}
        <div className="flex flex-col p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="epochInput" className="text-base font-semibold">
              Epoch to Human Readable Date
            </Label>
            <ClearInputButton onClear={() => setEpochInput("")} />
          </div>
          <div className="flex gap-2">
            <Input
              id="epochInput"
              placeholder="e.g. 1672531199"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              className="font-mono text-base"
            />
          </div>
          <div className="flex-1 bg-white dark:bg-slate-950 rounded-md border p-4 min-h-[120px]">
            {epochResult ? (
              <div className="space-y-3 font-mono text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase mb-1">Local Time</span>
                  <span>{epochResult.toString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase mb-1">UTC Time</span>
                  <span>{epochResult.toUTCString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase mb-1">ISO 8601</span>
                  <span>{epochResult.toISOString()}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                {epochInput ? "Invalid epoch timestamp" : "Enter a timestamp..."}
              </div>
            )}
          </div>
        </div>

        {/* Date to Epoch */}
        <div className="flex flex-col p-4 rounded-lg bg-card text-card-foreground border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dateInput" className="text-base font-semibold">
              Human Readable Date to Epoch
            </Label>
            <ClearInputButton onClear={() => setDateInput("")} />
          </div>
          <div className="flex gap-2">
            <Input
              id="dateInput"
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="font-mono text-base"
            />
          </div>
          <div className="flex-1 bg-white dark:bg-slate-950 rounded-md border p-4 min-h-[120px] flex items-center justify-center">
            {dateResult ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl font-mono font-bold text-primary">{dateResult}</span>
                <CopyToClipboard text={dateResult.toString()} />
              </div>
            ) : (
              <div className="text-slate-400 italic">
                {dateInput ? "Invalid date format" : "Select a date and time..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
