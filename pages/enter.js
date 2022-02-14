import Image from 'next/image';
import Metatags from '@components/Metatags';
import { signInAnonymously, signInWithPopup } from 'firebase/auth';
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore';
import { auth, googleAuthProvider } from '@lib/firebase';
import { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '@lib/context';
import debounce from 'lodash.debounce';

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  return (
    <>
      <Metatags title="Enter" description="Signup or login to this app !" />
      <main>
        {user ? (
          !username ? (
            <UsernameForm />
          ) : (
            <WelcomeMessage username={username} />
          )
        ) : (
          <SignInButton />
        )}
      </main>
    </>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="align-items mt-5 flex justify-center gap-2">
      <button
        className="align-items flex justify-center gap-2 rounded bg-blue-500 py-2 px-4 text-2xl text-white"
        onClick={signInWithGoogle}
      >
        <Image src="/google.png" width={30} height={30} alt="google icon" />
        <span className="">Sign in with Google</span>
      </button>
      <button
        className="rounded bg-gray-500 py-2 px-4 text-2xl text-white"
        onClick={() => signInAnonymously(auth)}
      >
        Sign in anonymously
      </button>
    </div>
  );
}

function WelcomeMessage(props) {
  return (
    <div className="mt-5 flex flex-col items-center gap-7">
      <h1 className="text-3xl font-bold">Welcome {props.username}</h1>
      <p className="text-gray-500">You are now signed in !</p>
    </div>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const batch = writeBatch(getFirestore());
      batch.set(doc(getFirestore(), 'users', user.uid), {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(doc(getFirestore(), 'usernames', formValue), {
        uid: user.uid,
      });
      await batch.commit();
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setIsLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setIsLoading(true);
      setIsValid(true);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      try {
        if (username.length >= 3) {
          const snap = await getDoc(doc(getFirestore(), 'usernames', username));
          setIsValid(!snap.exists());
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section className="mt-5">
        <h3 className="text-xl font-bold">Choose Username</h3>

        <form className="mt-3 flex" onSubmit={onSubmit}>
          <input
            className="mr-2 rounded border border-gray-400 p-2"
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <button
            className="enabled:cursor-pointer rounded bg-blue-500 py-1 px-2 text-2xl text-white disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
            type="submit"
            disabled={!isValid}
          >
            Choose
          </button>
        </form>

        <UsernameMessage
          username={formValue}
          isValid={isValid}
          isLoading={isLoading}
        />

        <h3 className="mt-3 text-lg">Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {isLoading.toString()}
          <br />
          Valid: {isValid.toString()}
          <br />
        </div>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, isLoading }) {
  if (isLoading) {
    return <p className="text-blue-500">Checking...</p>;
  } else if (isValid) {
    return <p className="text-green-500">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-red-500">That username is invalid!</p>;
  } else {
    return <p></p>;
  }
}
