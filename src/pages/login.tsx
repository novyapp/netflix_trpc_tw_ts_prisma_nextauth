import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getProviders, signIn, useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/router";

function login({ providers }: any) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <h1 className="font-extrabold text-6xl text-[#E50914]">NOVIE</h1>
        <meta name="description" content="Novie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />
      <Link href="/">
        <h1 className="font-extrabold text-6xl text-[#E50914]">NOVIE</h1>
      </Link>
      <div className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14">
        <h1 className="text-4xl font-semibold">Sign in with:</h1>
        <div className="space-y-4">
          {providers &&
            Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <a
                  href={provider.signinUrl}
                  onClick={(e) => e.preventDefault()}
                >
                  <button
                    className="w-full rounded bg-[#e50924] py-3 font-semibold flex items-center space-x-2 pl-4 pr-4"
                    onClick={(e) => {
                      e.preventDefault();
                      signIn(provider.id, {
                        callbackUrl: `${window.location.origin}/`,
                      });
                    }}
                  >
                    <p>{provider.id === "github" ? <FaGithub /> : null}</p>
                    <p>{provider.name}</p>
                  </button>
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
