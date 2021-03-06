import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { UserContext } from '@lib/context';
import { LogoutIcon } from '@heroicons/react/outline';

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav
      className="weight-bold border-b-solid fixed top-0 z-50 h-20 w-full justify-between border-b-2 border-b-gray-300 bg-white md:px-20"
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
          {user && <SignOutButton />}
          {username && (
            <>
              <Link href="/admin" passHref>
                <button className="rounded bg-blue-500 px-3 py-2 text-2xl text-white md:px-4">
                  Write Posts
                </button>
              </Link>
              <Link href={`/${username}`}>
                {user && user.photoURL ? (
                  <a>
                    <Image
                      src={user.photoURL}
                      alt="user profile photo"
                      className="h-12 w-12 cursor-pointer rounded-full"
                      width={50}
                      height={50}
                    />
                  </a>
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
                <button className="rounded bg-blue-500 py-2 px-4 text-2xl text-white">
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function SignOutButton() {
  const router = useRouter();
  const signOutNow = () => {
    try {
      signOut(auth);
      router.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button
      className="rounded bg-red-500 px-2 py-2 text-2xl text-white md:px-4"
      onClick={signOutNow}
    >
      <LogoutIcon className="h-8 w-8 text-white" />
    </button>
  );
}
