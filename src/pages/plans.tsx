import React from "react";
import Head from "next/head";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { getSession } from "next-auth/react";
import { stripe } from "../utils/stripe";

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  // if (session?.user?.userSubscription !== "notier") {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

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
  console.log(plans);
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
        <title>Novie</title>
        <meta name="description" content="Novie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <h1 className="font-extrabold text-6xl text-[#E50914]">NOVIE</h1>
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
