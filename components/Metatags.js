import Head from 'next/head';

export default function Metatags({
  title = 'Blog',
  description = 'A social blog for sharing ideas',
  image = 'https://wl-sympa.cf.tsp.li/resize/728x/jpg/3c4/52c/1c5e9d50d383826ecbb495ea0e.jpg',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta charset="UTF-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content="Blog, Next, JS" />
      <meta name="author" content="Pierre HOFMAN" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@Pierre_Hofman" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
