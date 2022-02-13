import Image from 'next/image';

export default function UserProfile({ user }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <div className="h-48 w-48">
        <Image
          className="rounded-full"
          src={user.photoURL}
          width="500"
          height="500"
          alt="user photo"
        />
      </div>
      <p>
        <i>@{user.username}</i>
      </p>
      <h1 className="mt-5 text-4xl font-bold">{user.displayName}</h1>
    </div>
  );
}
