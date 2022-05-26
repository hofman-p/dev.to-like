# social-blog
Dev.to-like blog using Next.js, TailwindCSS and Firebase v9

## Features
* Create articles with custom username
* See other people articles
* Publish publicly and SEO-friendly
* Readers can heart, like and clap posts in real time
* Draft mode for articles
* Delete articles
* Upload images files
* Sign in with your Google account
* Responsive UI

## Under the hood
* Firebase v9 and security rules
* Firestore realtime CRUD and data modeling
* Next.js SSR, SSG and ISR implementation
* react-hook-form reactive forms
* Realtime data hydration
* Use of TailwindCSS
* Google OAuth
* Dynamic metatags for SEO
* Custom hook and context
* Custom 404 page

## What you need first
You need to have installed:
* Node.js

Create a Firebase app here: https://firebase.google.com \
Firebase will provide you with all your app information.

Create a `.env` file at root level and fill it with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=yourfirebaseapikey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourfirebaseauthdomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourfirebaseprojectid
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourfirebasestoragebucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=yourfirebasemessagingsenderid
NEXT_PUBLIC_FIREBASE_APP_ID=yourfirebaseappid
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=yourfirebasemeasurementid
```

## How to start
1. Type `npm i` to install all modules
2. Then type `npm run dev` or `yarn dev`
3. Visit `http://localhost:3000`
4. Enjoy !
