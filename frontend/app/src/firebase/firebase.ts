import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Runtime check to ensure environment variables are loaded
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error(
    'Firebase config is missing. Make sure you have a .env.local file with the required environment variables. ' +
    'You can generate it by running `npm run dev` from the `app` directory, ' +
    'which uses the `deploy/env/dev.json` configuration.'
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This pattern prevents re-initializing the app on hot reloads in development
let app: FirebaseApp;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

export const auth: Auth = getAuth(app);