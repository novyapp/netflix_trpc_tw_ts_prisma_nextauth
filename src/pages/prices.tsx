import React from "react";
import initStripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

export const getStaticProps = async () => {
  const stripe = initStripe(
    `sk_test_51LIvOrD5RlaM55m9pGOBlaxfOL7yZ068afFx48bAUgc3Uffr9aD0pZxAxVYTSIzxI6PQYcOUHEK1frFyzgHj4LTg00pvaTkyph`
  );
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
        meta: product.metadata,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};

const prices = ({ plans }) => {
  const processSubscription = (planId) => async () => {
    const res = await fetch(`/api/stripe/${planId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { redirectUrl } = await res.json();
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      console.log("Error creating checkout session");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            ${plan.price / 100} / {plan.interval}
          </p>
          <button onClick={processSubscription(plan.id, plan)}>
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
};

export default prices;
