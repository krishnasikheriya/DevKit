import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Snippet from "@/models/Snippet";
import { SnippetViewer } from "@/components/ui/snippet-viewer";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { Share2, Clock, User, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await connectToDatabase();
  const { slug } = await params;
  const snippet = await Snippet.findOne({ slug, isPublic: true }).populate("userId", "name");

  if (!snippet) {
    return { title: "Snippet Not Found" };
  }

  return {
    title: `${snippet.title} - DevKit Snippet`,
    description: `A ${snippet.language} snippet shared via DevKit`,
  };
}

export default async function SnippetPage({ params }: { params: { slug: string } }) {
  await connectToDatabase();
  const { slug } = await params;
  // We use populate to get the author's name
  const snippet = await Snippet.findOne({ slug, isPublic: true }).populate("userId", "name image");

  if (!snippet) {
    notFound();
  }

  const authorName = snippet.userId?.name || "Anonymous Developer";
  const dateStr = new Date(snippet.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-full flex flex-col p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Share2 className="h-7 w-7 text-primary" />
            {snippet.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
              <User className="h-3.5 w-3.5" />
              {authorName}
            </span>
            <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
              <Code2 className="h-3.5 w-3.5" />
              {snippet.language.toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
              <Clock className="h-3.5 w-3.5" />
              {dateStr}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <CopyToClipboard text={snippet.content} />
        </div>
      </div>

      {snippet.language === "markdown" ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
          <div className="border rounded-lg overflow-hidden bg-card shadow-sm flex flex-col">
            <div className="flex items-center p-2 px-4 border-b bg-muted/30">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Raw Markdown
              </span>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0">
                <SnippetViewer content={snippet.content} language={snippet.language} />
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{snippet.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 border rounded-lg overflow-hidden bg-card shadow-sm min-h-[400px]">
          <div className="h-full w-full">
            <SnippetViewer content={snippet.content} language={snippet.language} />
          </div>
        </div>
      )}
    </div>
  );
}
