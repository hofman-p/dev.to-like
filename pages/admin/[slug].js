import Link from 'next/link';
import AuthCheck from '@components/AuthCheck';
import ImageUploader from '@components/ImageUploader';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '@lib/firebase';
import {
  doc,
  getFirestore,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';

export default function AdminPostEditPage({}) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;
  const postRef = doc(
    getFirestore(),
    'users',
    auth.currentUser.uid,
    'posts',
    slug
  );
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className="mt-4 lg:flex">
      {post && (
        <>
          <section className="mr-4 flex flex-col gap-5 lg:w-4/6">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p>
              <strong>Slug:</strong> {post.slug}
            </p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside className="sticky top-20 flex h-0 w-1/6 flex-col gap-3 text-center">
            <h3 className="text-2xl">Tools</h3>
            <button
              className="text-1xl rounded bg-gray-400 py-3 px-2 text-white"
              onClick={() => setPreview(!preview)}
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`} passHref>
              <button className="text-1xl rounded bg-blue-500 py-3 px-2 text-white">
                Live view
              </button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="prose my-4 rounded-lg border border-solid border-gray-300 bg-white p-7">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? 'hidden' : 'flex flex-col gap-3'}>
        <ImageUploader />

        <textarea
          className="h-[60vh] border-none p-2 text-xl outline-none"
          {...register('content', {
            minLength: { value: 10, message: 'content is too short' },
            maxLength: { value: 20000, message: 'content is too long' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}

        <fieldset className="flex items-center gap-2 border-none pt-2 text-xl">
          <input
            id="published"
            className="inline w-auto"
            type="checkbox"
            {...register('published')}
          />
          <label htmlFor="published">Published</label>
        </fieldset>

        <button
          className="w-50 enabled:cursor-pointer self-center rounded bg-green-500 py-2 px-4 text-3xl text-white disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
          type="submit"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await deleteDoc(postRef);
      router.push('/admin');
      toast('Post annihilated ', { icon: '🗑️' });
    }
  };

  return (
    <button
      className="text-1xl rounded bg-red-500 py-3 px-2 text-white"
      onClick={deletePost}
    >
      Delete
    </button>
  );
}
