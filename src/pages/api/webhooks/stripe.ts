import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe";
import { prisma } from "../../../server/db/client";

const endpointSecret = `${process.env.STRIPE_ENDPOINT_SECRET}`;

export const config = {
  api: {
    bodyParser: false, // don't parse body of incoming requests because we need it raw to verify signature
  },
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const requestBuffer = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      // Use the Stripe SDK and request info to verify this Webhook request actually came from Stripe
      event = stripe.webhooks.constructEvent(
        requestBuffer.toString(), // Stringify the request for the Stripe library
        sig,
        endpointSecret
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook signature verification failed.`);
    }
    const subscription = event.data.object as Stripe.Subscription;
    const sub_product = subscription.plan.product;
    const productinfo = await stripe.products.retrieve(sub_product);
    // Handle the event
    switch (event.type) {
      // Handle successful subscription creation
      case "customer.subscription.created": {
        await prisma.user.update({
          where: {
            id: subscription.metadata.payingUserId,
          },
          data: {
            isActive: true,
            userSubscription: productinfo.name as string,
          },
        });
        break;
      }
      case "customer.subscription.updated": {
        await prisma.user.update({
          where: {
            id: subscription.metadata.payingUserId,
          },
          data: {
            isActive: true,
            userSubscription: productinfo.name as string,
          },
        });
        break;
      }
      case "customer.subscription.deleted": {
        await prisma.user.update({
          where: {
            id: subscription.metadata.payingUserId,
          },
          data: {
            isActive: false,
          },
        });
        break;
      }
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    // Return a 500 error
    console.log(err);
    res.status(500).end();
  }
};
