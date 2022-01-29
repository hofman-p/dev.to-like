import Link from "next/link";
import Image from "next/image";
import { BeakerIcon } from "@heroicons/react/solid";

// Top navbar
export default function Navbar() {
  const user = null;
  const username = true;
  return (
    <nav
      className="weight-bold border-b-solid fixed top-0 z-50 w-full justify-between border-b-2 border-b-gray-300 bg-white text-blue-500 md:px-20"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between p-3 md:p-0">
        <Link href="/" passHref>
          <button className="rounded bg-black py-2 px-4 text-2xl uppercase text-white">
            POSTS
          </button>
        </Link>
        {/* User is signed-in and has a username */}
        <div className="flex items-center justify-center gap-2 text-white">
          {username && (
            <>
              <Link href="/admin" passHref>
                <button className="rounded bg-blue-500 py-2 px-4 text-2xl text-white">
                  Write Posts
                </button>
              </Link>
              <Link href={`/${username}`} passHref>
                {user ? (
                  <Image
                    src={user.photoURL}
                    alt="user profile photo"
                    className="h-12 w-12 cursor-pointer rounded-full"
                    width={50}
                    height={50}
                  />
                ) : (
                  <div className="h-12 w-12 cursor-pointer rounded-full border-2"></div>
                )}
              </Link>
            </>
          )}
          {/* User is not signed-in or has not created username */}
          {!username && (
            <>
              <Link href="/enter" passHref>
                <button>Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
