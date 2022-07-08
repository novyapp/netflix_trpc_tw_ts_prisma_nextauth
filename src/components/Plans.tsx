import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { CheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import Stripe from "stripe";

function Plans() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignout = (e: any) => {
    e.preventDefault();
    signOut({ redirect: false });
    router.push("/login");
  };

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const goToCheckout = async () => {
    setIsCheckoutLoading(true);
    const res = await fetch(`/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { redirectUrl } = await res.json();
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      setIsCheckoutLoading(false);
      console.log("Error creating checkout session");
    }
  };
  const goToPremium = async () => {
    setIsCheckoutLoading(true);
    const res = await fetch(`/api/stripe/premium`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { redirectUrl } = await res.json();
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      setIsCheckoutLoading(false);
      console.log("Error creating checkout session");
    }
  };

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
        {session && (
          <button
            onClick={handleSignout}
            className="text-lg font-medium hover:underline"
          >
            Sign Out
          </button>
        )}
        {status === "loading" && <p>Loading...</p>}
        {status === "unauthenticated" && <p>Access Denied</p>}
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
            <div className="planBox">Standard</div>
            <div className="planBox">Standard</div>
            <div className="planBox">Standard</div>
          </div>
          <button onClick={loadPortal}>Manage portal</button>
          <button>Subscribe</button>

          {session && <p>{JSON.stringify(session)}</p>}
          {session && (
            <div>
              <p>{JSON.stringify(session)}</p>

              <button
                onClick={() => {
                  if (isCheckoutLoading) return;
                  else goToCheckout();
                }}
              >
                {isCheckoutLoading ? "Loading..." : "Standard"}
              </button>
              <br />
              <br />
              <br />
              <button
                onClick={() => {
                  if (isCheckoutLoading) return;
                  else goToPremium();
                }}
              >
                {isCheckoutLoading ? "Loading..." : "Premium"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Plans;
