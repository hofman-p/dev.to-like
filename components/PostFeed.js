import Link from 'next/link';

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  const wordCount = post?.content?.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  return (
    <Link href={`/${post.username}/${post.slug}`} passHref>
      <div className="my-4 cursor-pointer rounded-lg border border-solid border-gray-300 bg-white p-7">
        <div className="flex justify-between">
          <h2 className="my-2 text-2xl font-bold">{post.title}</h2>
          {admin && (
            <div className="flex items-center justify-center gap-3">
              {post.published ? (
                <p className="font-bold text-green-500">Live</p>
              ) : (
                <p className="font-bold text-red-500">Unpublished</p>
              )}
              <Link href={`/admin/${post.slug}`} passHref>
                <button className="text-1xl w-14 rounded bg-blue-500 py-1 px-2 text-white">
                  Edit
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="text-gray-500">
          <Link href={`/${post.username}`}>
            <a>
              <strong>By @{post.username}</strong>
            </a>
          </Link>
        </div>

        <footer className="mt-8 flex justify-between">
          <span>
            {wordCount} word(s) {minutesToRead} minute(s) to read.
          </span>
          <span>{post.heartCount || 0} 🤍</span>
        </footer>
      </div>
    </Link>
  );
}
