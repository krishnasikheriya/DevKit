import mongoose, { Schema, Document, models } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  slug?: string;
  userId: mongoose.Types.ObjectId;
}

const SnippetSchema = new Schema<ISnippet>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    // Ensure slug is unique but can be sparse/null if not public.
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // Ensure userId references the 'User' model.
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Snippet = models.Snippet || mongoose.model<ISnippet>('Snippet', SnippetSchema);

export default Snippet;