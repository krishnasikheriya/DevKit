import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Snippet from "@/models/Snippet";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Define a Zod schema to validate the incoming snippet data
const snippetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  language: z.string().min(1, "Language is required"),
  isPublic: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Validate the body using your Zod snippetSchema
    const validation = snippetSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Bad Request", details: validation.error.format() }, 
        { status: 400 }
      );
    }

    const { title, content, language, isPublic } = validation.data;

    // Extract validated data. If isPublic is true, generate a unique slug.
    let slug = undefined;
    if (isPublic) {
      // Using native Web Crypto API to generate a unique identifier for the slug
      slug = crypto.randomUUID(); 
    }

    // Extract the MongoDB user ID we appended to the session in the NextAuth callback
    const userId = (session.user as any).id;

    // Create a new Snippet document referencing the user's ID
    const newSnippet = await Snippet.create({
      title,
      content,
      language,
      isPublic,
      slug,
      userId,
    });

    return NextResponse.json(newSnippet, { status: 201 });
  } catch (error) {
    console.error("Failed to create snippet:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Extract the MongoDB user ID from the session
    const userId = (session.user as any).id;

    // Query the Snippet model for all snippets belonging to the current user.
    // Sort them by createdAt in descending order (-1).
    const snippets = await Snippet.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(snippets, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch snippets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}