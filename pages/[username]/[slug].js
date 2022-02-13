import Metatags from '@components/Metatags';
import PostContent from '@components/PostContent';
import {
  doc,
  getDoc,
  getFirestore,
  query,
  collectionGroup,
  limit,
  getDocs,
} from 'firebase/firestore';
import { getUserWithUsername, postToJson } from '@lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { UserContext } from '@lib/context';
import { useContext } from 'react';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);
    const postDoc = await getDoc(postRef);

    post = postToJson(postDoc);
    if (!post) {
      return {
        notFound: true,
      };
    }
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  const q = query(collectionGroup(getFirestore(), 'posts'), limit(20));
  const snapshot = await getDocs(q);
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
}

export default function PostPage(props) {
  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;
  const { user: currentUser } = useContext(UserContext);
  let admin = currentUser?.uid === post?.uid ? true : false;

  return (
    <>
      <Metatags title="Post" description="Post" />
      <main>
        <PostContent post={post} postRef={postRef} admin={admin} />
      </main>
    </>
  );
}
