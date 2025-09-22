// pages/index.tsx

import type { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';

// This is just a simple welcome page after login.
const HomePage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {session?.user?.name}!</h1>
        <p className="text-gray-600 mt-2">You are now logged in to the ULP Admin panel.</p>
        <Link href="/properties" legacyBehavior>
          <a className="mt-6 inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded hover:bg-indigo-700 transition duration-300">
            Go to Property Management
          </a>
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the user session from the request
  const session = await getSession(context);

  // If there is no session, redirect to the login page
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false, // Not a permanent redirect
      },
    };
  }

  // If the session exists, the page will be rendered
  // The session object is available through the useSession hook
  return {
    props: {},
  };
};

export default HomePage;