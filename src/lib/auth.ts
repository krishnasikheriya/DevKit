import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import connectToDatabase from './mongoose';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    // Check if the user exists in MongoDB; if not, create a new document
    async signIn({ user, account, profile }) {
      try {
        await connectToDatabase();

        // Check if user already exists via email
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create a new user document if they don't exist
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        return true;
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // Reject sign-in on error
      }
    },
    
    // Append the MongoDB user ID to the session object so it can be accessed client-side
    async session({ session, token }) {
      try {
        await connectToDatabase();

        // Look up the user in the database using the email stored in the session
        if (session.user?.email) {
          const dbUser = await User.findOne({ email: session.user.email });
          
          if (dbUser) {
            // Append the stringified MongoDB object ID to the session user object
            (session.user as any).id = dbUser._id.toString();
          }
        }
      } catch (error) {
        console.error("Error during session callback:", error);
      }

      return session;
    },
  },
  pages: {
    // Optionally specify custom sign-in or error pages here
  },
  session: {
    strategy: 'jwt',
  },
};