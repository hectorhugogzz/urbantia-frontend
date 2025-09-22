// pages/properties/[id].tsx

import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Header } from '@/components/Header';
import { Panel } from '@/components/Panel';
import PropertyForm from '@/components/PropertyForm';
import { Property } from '@/types';
// We will create and add these components in a future step
// import AssetGallery from '../../src/components/properties/AssetGallery';
// import AssetUploader from '../../src/components/properties/AssetUploader';

interface EditPropertyPageProps {
  property: Property;
}

const EditPropertyPage: NextPage<EditPropertyPageProps> = ({ property }) => {
  const router = useRouter();

  /**
   * Handles the submission of the updated property form.
   * This function will be passed to the reusable PropertyForm component.
   * @param propertyData - The form data for the property being updated.
   */
  const handleUpdateProperty = async (propertyData: Partial<Property>) => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update property');
      }

      // If update is successful, redirect the user back to the main properties list.
      await router.push('/properties');

    } catch (error) {
      console.error('Update error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <Panel>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Edit Property: <span className="text-indigo-600">{property.property_name}</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Listing ID: {property.listing_id || 'N/A'}
            </p>
          </div>

          {/* 
            TODO: Add the Asset Gallery and Uploader components here in the future.
            <AssetGallery assets={property.gcs_image_urls} />
            <AssetUploader propertyId={property.id} /> 
          */}
          
          <div className="mt-8 border-t pt-8">
             <h2 className="text-xl font-semibold text-gray-700 mb-4">Property Details</h2>
             {/* 
                Render the reusable form component.
                - We pass the save handler for the "update" action.
                - We pass the fetched property data as initialData to pre-populate the form.
             */}
             <PropertyForm onSave={handleUpdateProperty} initialData={property} />
          </div>

        </Panel>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host;
    const res = await fetch(`${protocol}://${host}/api/properties/${id}`);

    // If property is not found, API returns 404. We redirect to a 404 page.
    if (res.status === 404) {
      return { notFound: true };
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch property, status: ${res.status}`);
    }

    const property: Property = await res.json();

    return {
      props: {
        property,
      },
    };
  } catch (error) {
    console.error(`Error fetching property ${id} in getServerSideProps:`, error);
    return { notFound: true }; // Redirect to 404 on any error
  }
};

export default EditPropertyPage;