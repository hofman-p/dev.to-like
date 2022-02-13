import Metatags from '@components/Metatags';
import UserProfile from '@components/UserProfile';
import PostFeed from '@components/PostFeed';
import { getUserWithUsername, postToJson } from '@lib/firebase';
import {
  query,
  collection,
  getFirestore,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery;
  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJson);
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <>
      <Metatags title="Profile" description="User's profile" />
      <main>
        <UserProfile user={user} />
        <PostFeed posts={posts} />
      </main>
    </>
  );
}
