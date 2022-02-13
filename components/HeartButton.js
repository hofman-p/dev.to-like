import { auth } from '@lib/firebase';
import { doc, getFirestore, writeBatch, increment } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

// Allows user to heart or like a post
export default function Heart({ post, postRef }) {
  // Listen to heart document for currently logged in user
  const heartRef = doc(
    getFirestore(),
    postRef.path,
    'hearts',
    auth.currentUser.uid
  );
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>{post.heartCount || 0} 💔</button>
  ) : (
    <button onClick={addHeart}>{post.heartCount || 0} 💗</button>
  );
}
