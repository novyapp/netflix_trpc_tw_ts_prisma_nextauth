import React from "react";
import initStripe from "stripe";
import Head from "next/head";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import Table from "@/components/Table";
import Loader from "@/components/Loader";

export const getStaticProps = async () => {
  const stripe = new initStripe(
    "sk_test_51LIvOrD5RlaM55m9pGOBlaxfOL7yZ068afFx48bAUgc3Uffr9aD0pZxAxVYTSIzxI6PQYcOUHEK1frFyzgHj4LTg00pvaTkyph" as string,
    {
      apiVersion: "2020-08-27",
    }
  );
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price: any) => {
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

const Plans = ({ plans }: any) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(plans[1]);
  const [isBillingLoading, setBillingLoading] = useState<boolean>(false);

  const processSubscription = (planId: string) => async () => {
    setBillingLoading(true);
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
    <div>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Netflix Clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that's right for you
        </h1>
        <ul>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want.
            Ad-free.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations
            just for you.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel
            your plan anytime.
          </li>
        </ul>
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center justify-center self-end md:w-3/5">
            {plans.map((plan: any) => (
              <div
                key={plan.id}
                className={`planBox ${
                  selectedPlan?.id === plan.id ? "opacity-100" : "opacity-60"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.name}
              </div>
            ))}
          </div>

          <Table plans={plans} selectedPlan={selectedPlan} />

          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && "opacity-60"
            }`}
            onClick={processSubscription(selectedPlan.id)}
          >
            {isBillingLoading ? (
              <Loader color="dark:fill-gray-300" />
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Plans;
