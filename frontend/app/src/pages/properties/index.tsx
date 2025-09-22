// pages/properties/index.tsx

import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Property } from '@/types';
import PropertyTable from './PropertyTable'; // We will create this component next
import { Header } from '@/components/Header'; // Assuming you have a Header component
import { Panel } from '@/components/Panel'; // Assuming you have a Panel component

// Define the props that this page will receive
interface PropertiesPageProps {
  initialProperties: Property[];
}

const PropertiesPage: NextPage<PropertiesPageProps> = ({ initialProperties }) => {
  // Use state to manage the list of properties, allowing for future client-side updates
  // (e.g., live search/filter) without re-fetching from the server.
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <Panel>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Property Management
            </h1>
            <Link href="/properties/new" legacyBehavior>
              <a className="mt-4 md:mt-0 inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                + Add New Property
              </a>
            </Link>
          </div>

          {/* We will render the table component here, passing the properties data */}
          <PropertyTable properties={properties} />
        </Panel>
      </main>
    </>
  );
};

// --- Server-Side Data Fetching ---
// This function runs on the server before the page is rendered.
// It fetches the initial list of properties from our own API.
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // IMPORTANT: When fetching from an API route on the server-side,
    // you must use the absolute URL.
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host; // e.g., 'localhost:3000'
    const res = await fetch(`${protocol}://${host}/api/properties`);

    if (!res.ok) {
      throw new Error(`Failed to fetch properties, status: ${res.status}`);
    }

    const initialProperties: Property[] = await res.json();

    // Pass the fetched data to the page component as props.
    return {
      props: {
        initialProperties,
      },
    };
  } catch (error) {
    console.error('Error fetching properties in getServerSideProps:', error);
    // Return an empty array in case of an error so the page can still render.
    return {
      props: {
        initialProperties: [],
      },
    };
  }
};

export default PropertiesPage;
