import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Snippet from "@/models/Snippet";
import { Share2, Clock, User, Code2 } from "lucide-react";
import { SnippetClientView } from "@/components/ui/snippet-client-view";

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
        <SnippetClientView content={snippet.content} language={snippet.language} title={snippet.title} />
      </div>
    </div>
  );
}
