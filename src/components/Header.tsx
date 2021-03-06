import { BellIcon, SearchIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import BasicMenu from "./BasicMenu";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);

  const handleSignout = (e: any) => {
    e.preventDefault();
    signOut({ redirect: false });
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`${isScrolled && "bg-[#141414]"}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <h1 className="font-extrabold text-6xl text-[#E50914]">NOVIE</h1>

        <BasicMenu />

        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">Home</li>
          <li className="headerLink">TV Shows</li>
          <li className="headerLink">Movies</li>
          <li className="headerLink">New & Popular</li>
          <li className="headerLink">My List</li>
        </ul>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light">
        <SearchIcon className="hidden h-6 w-6 sm:inline" />
        <p className="hidden lg:inline">Kids</p>
        <BellIcon className="h-6 w-6" />

        {session && (
          <Link href="/account" className="btn-signin">
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
        )}
        {!session && (
          <Link href="/login" className="btn-signin">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
