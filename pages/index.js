import Metatags from '@components/Metatags';
import Link from 'next/link';
import PostFeed from '@components/PostFeed';
import Loader from '@components/Loader';
import { postToJson } from '@lib/firebase';
import {
  getFirestore,
  collectionGroup,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  startAfter,
} from 'firebase/firestore';
import { useState } from 'react';

const MAX_FEED_POSTS = 10;

export async function getServerSideProps() {
  const postsQuery = query(
    collectionGroup(getFirestore(), 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(MAX_FEED_POSTS)
  );
  const posts = (await getDocs(postsQuery)).docs.map(postToJson);
  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor =
      typeof last?.createdAt === 'number'
        ? Timestamp.fromMillis(last.createdAt)
        : last?.createdAt;
    const postsQuery = query(
      collectionGroup(getFirestore(), 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(MAX_FEED_POSTS)
    );
    const postsDocs = await getDocs(postsQuery);
    let newPosts;
    if (postsDocs) {
      newPosts = postsDocs.docs.map((doc) => doc.data);
      setPosts(posts.concat(newPosts));
    }
    setLoading(false);
    if (newPosts.length < MAX_FEED_POSTS) {
      setPostsEnd(true);
    }
  };

  return (
    <>
      <Metatags title="Blog" description="Welcome to this social blog !" />
      <main className="flex flex-col">
        <PostFeed posts={posts} />
        {posts.length === 0 && (
          <div className="mt-8 flex flex-col items-center gap-8 text-black">
            <h1 className="text-2xl">There is no post yet...</h1>
            <span>
              Be the first to{' '}
              <Link href="/admin">
                <a className="text-blue-500">write one !</a>
              </Link>
            </span>
          </div>
        )}
        {!loading && !postsEnd && posts.length > 0 && (
          <button
            className="w-50 cursor-pointer self-center rounded bg-green-500 py-2 px-4 text-3xl text-white"
            onClick={getMorePosts}
          >
            Load more
          </button>
        )}
        <Loader show={loading} />
        {postsEnd && <p className="text-center">No more posts to load</p>}
      </main>
    </>
  );
}
