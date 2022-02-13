import Link from 'next/link';

export default function Custom404() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center gap-10">
        <h1 className="mt-10 text-6xl font-bold">
          404 - That page does not seem to exist...
        </h1>
        <iframe
          src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
          width="480"
          height="362"
          frameBorder="0"
          allowFullScreen
        ></iframe>
        <Link href="/" passHref>
          <button className="text-1xl rounded bg-blue-500 py-3 px-2 text-white">
            Go home
          </button>
        </Link>
      </div>
    </main>
  );
}
