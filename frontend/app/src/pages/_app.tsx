// pages/_app.tsx

import '@/styles/globals.css'; // Your global stylesheet
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    // The SessionProvider makes the session object available to all components.
    <SessionProvider session={session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;