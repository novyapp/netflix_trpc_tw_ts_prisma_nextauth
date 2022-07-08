import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import GoogleProvider from "next-auth/providers/google";
import Stripe from "stripe";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      // Create stripe API client using the secret key env variable
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2020-08-27",
      });

      // Create a stripe customer for the user with their email address
      await stripe.customers
        .create({
          email: user.email!,
          name: user.name!,
        })
        .then(async (customer) => {
          // Use the Prisma Client to update the user in the database with their new Stripe customer ID
          return prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: customer.id,
            },
          });
        });
    },
  },
  callbacks: {
    async session({ session, user }) {
      session!.user!.id = user.id;
      session!.user!.isActive = user.isActive as boolean;
      session!.user!.stripeCustomerId = user.stripeCustomerId as string;

      return session;
    },
  },
};

export default NextAuth(authOptions);
