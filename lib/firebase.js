import { getApp, initializeApp } from 'firebase/app';
import {
  getFirestore,
  query,
  collection,
  where,
  limit,
  getDocs,
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch (error) {
    return initializeApp(config);
  }
}

const app = createFirebaseApp(firebaseConfig);

export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const STATE_CHANGED = 'state_changed';

export async function getUserWithUsername(username) {
  const q = query(
    collection(db, 'users'),
    where('username', '==', username),
    limit(1)
  );
  return (await getDocs(q)).docs[0];
}

export function postToJson(doc) {
  const data = doc.data();
  if (data) {
    return {
      ...data,
      createdAt: data?.createdAt.toMillis() || 0,
      updatedAt: data?.updatedAt.toMillis() || 0,
    };
  }
  return null;
}
