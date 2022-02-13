import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import AuthCheck from '@components/AuthCheck';
import HeartButton from '@components/HeartButton';

export default function PostContent({ post, postRef, admin = false }) {
  const createdAt =
    typeof post?.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt.toDate();
  return (
    <div className="my-4 rounded-lg border border-solid border-gray-300 bg-white p-7">
      <div className="flex justify-between">
        <div>
          <h1 className="my-2 text-2xl font-bold">{post?.title}</h1>
          <div className="text-gray-500">
            <Link href={`/${post.username}`}>
              <a>
                By <strong>@{post.username}</strong>
              </a>
            </Link>{' '}
            on {createdAt.toISOString().substring(0, 10)}
          </div>
        </div>
        {admin && (
          <div>
            <Link href={`/admin/${post.slug}`} passHref>
              <button className="text-1xl w-14 rounded bg-blue-500 py-1 px-2 text-white">
                Edit
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className="prose mt-8">
        <ReactMarkdown>{post?.content}</ReactMarkdown>
      </div>
      <div className="flex justify-end">
        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>{post.heartCount || 0} 🤍</button>
            </Link>
          }
        >
          <HeartButton post={post} postRef={postRef} />
        </AuthCheck>
      </div>
    </div>
  );
}
