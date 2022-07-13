import React from "react";
import Head from "next/head";
import Link from "next/link";
import Membership from "@/components/Membership";
import { stripe } from "@/utils/stripe";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import moment from "moment";

const Account = ({ plans, subscriptions }) => {
  const { data: session } = useSession();
  //console.log(subscriptions);

  const loadPortal = async () => {
    const res = await fetch(`/api/stripe/portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { redirectUrl } = await res.json();
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      console.log("Error creating portal session");
    }
  };
  return (
    <div>
      <Head>
        <title>Account Settiings - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={`bg-[#141414]`}>
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            width={120}
            height={120}
            className="cursor-pointer object-contain"
            alt=""
          />
        </Link>
        <Link href="/account">
          <img
            src={
              session?.user?.image
                ? session?.user?.image
                : "https://rb.gy/g1pwyx"
            }
            alt=""
            className="cursor-pointer rounded w-8 h-8"
          />
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img src="https://rb.gy/4vfk4r" alt="" className="h-7 w-7" />
            <p className="text-xs font-semibold text-[#555]">
              Member since
              {new Date(subscriptions[0].created * 1000).toLocaleString()}
            </p>
          </div>
        </div>

        <Membership subscriptions={subscriptions} />

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4 className="text-lg text-[gray]">Plan Details</h4>
          {/* Find the current plan */}
          <div className="col-span-2 font-medium">
            {session?.user?.userSubscription}
          </div>
          <p
            className="cursor-pointer text-blue-500 hover:underline md:text-right"
            onClick={loadPortal}
          >
            Change plan
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p className="col-span-3 cursor-pointer text-blue-500 hover:underline">
            Sign out of all devices
          </p>
        </div>
      </main>
    </div>
  );
};

export default Account;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const stripeId = session?.user?.stripeCustomerId;

  const { data: prices } = await stripe.prices.list();

  const { data: subscriptions } = await stripe.subscriptions.list({
    customer: stripeId,
  });

  const plans = await Promise.all(
    prices.map(async (price: any) => {
      const product = await stripe.products.retrieve(price.product);
      return product;
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
      subscriptions: subscriptions,
    },
  };
};
