"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";

interface ShareSnippetProps {
  content: string;
  language: string;
  defaultTitle?: string;
}

export function ShareSnippet({
  content,
  language,
  defaultTitle = "My Snippet",
}: ShareSnippetProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  const handleShare = async () => {
    if (!content.trim()) {
      toast.error("Nothing to share!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          language,
          isPublic: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create snippet");
      }

      const data = await response.json();
      const url = `${window.location.origin}/snippet/${data.slug}`;
      setSharedUrl(url);

      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link generated & copied to clipboard!");
      } catch {
        toast.success("Snippet created successfully!");
      }
    } catch {
      toast.error("Failed to share snippet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => toast.info("Please sign in to share snippets.")}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <Share2 className="h-4 w-4" />
        Share
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Snippet</DialogTitle>
          <DialogDescription>
            Create a public link to share this {language} snippet with others.
          </DialogDescription>
        </DialogHeader>

        {!sharedUrl ? (
          <div className="space-y-4 pt-4 min-w-0">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Database Config"
              />
            </div>
            <Button className="w-full" onClick={handleShare} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
              )}
              Generate Link
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4 min-w-0 w-full">
            <div className="p-4 bg-muted rounded-md flex items-center justify-between gap-3 overflow-hidden">
              <span className="text-xs font-mono truncate flex-1 min-w-0">{sharedUrl}</span>
              <CopyToClipboard text={sharedUrl} className="shrink-0" />
            </div>
            <Button variant="outline" className="w-full" onClick={() => setSharedUrl(null)}>
              Share Another
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
