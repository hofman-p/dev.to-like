import AuthCheck from '@components/AuthCheck';
import PostFeed from '@components/PostFeed';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UserContext } from '@lib/context';
import { auth } from '@lib/firebase';
import {
  query,
  collection,
  orderBy,
  getFirestore,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import kebabCase from 'lodash.kebabcase';
import { toast } from 'react-hot-toast';

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const postQuery = query(
    collection(getFirestore(), 'users', auth.currentUser.uid, 'posts'),
    orderBy('createdAt')
  );
  const [querySnapshot] = useCollection(postQuery);
  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1 className="mt-10 mb-5 text-3xl font-bold">Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);
    toast.success('Post created!');
    router.push(`/admin/${slug}`);
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={createPost}>
      <input
        className="h-14 p-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button
        className="w-50 enabled:cursor-pointer self-center rounded bg-green-500 py-2 px-4 text-3xl text-white disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
        type="submit"
        disabled={!isValid}
      >
        Start writing...
      </button>
    </form>
  );
}
