import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Stripe from "stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: "2020-08-27",
  });

  // This object will contain the user's data if the user is signed in
  const session = await getSession({ req });

  // Error handling
  if (!session?.user) {
    return res.status(401).json({
      error: {
        code: "no-access",
        message: "You are not signed in.",
      },
    });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: session.user.stripeCustomerId,
    // {CHECKOUT_SESSION_ID} is a string literal which the Stripe SDK will replace; do not manually change it or replace it with a variable!
    return_url: `http://localhost:3000/account`,
  });

  if (!portalSession.url) {
    return res.status(500).json({
      cpde: "stripe-error",
      error: "Could not create portal session",
    });
  }
  // Return the newly-created checkoutSession URL and let the frontend render it
  return res.status(200).json({ redirectUrl: portalSession.url });
};
