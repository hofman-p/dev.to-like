import Image from 'next/image';
import Metatags from '@components/Metatags';
import { signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
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
            <SignOutButton />
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
    <>
      <button onClick={signInWithGoogle}>
        <Image src="/google.png" width={50} height={50} alt="google icon" />
        Sign in with Google
      </button>
      <button onClick={() => signInAnonymously(auth)}>
        Sign in anonymously
      </button>
    </>
  );
}

function SignOutButton() {
  const signOutFromGoogle = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };
  return <button onClick={signOutFromGoogle}>Sign out</button>;
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
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            isLoading={isLoading}
          />
          <button type="submit" disabled={!isValid}>
            Choose
          </button>
          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {isLoading.toString()}
            <br />
            Valid: {isValid.toString()}
            <br />
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, isLoading }) {
  if (isLoading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
