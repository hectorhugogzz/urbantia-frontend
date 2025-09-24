// pages/properties/view/[id].tsx

import type { GetServerSideProps, NextPage } from 'next';
import { Header } from '@/components/Header';
import { Panel } from '@/components/Panel';
import { Property } from '@/types';
import { format } from 'date-fns';

interface ViewPropertyPageProps {
  property: Property;
}

const ViewPropertyPage: NextPage<ViewPropertyPageProps> = ({ property }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <Panel>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {property.property_name}
            </h1>
            <p className="text-gray-600 mt-1">
              Listing ID: {property.listing_id || 'N/A'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-800">{property.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Price (MXN)</p>
                    <p className="text-gray-800 font-semibold">{formatCurrency(property.price_mxn)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-800">{property.location_zone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Property Type</p>
                    <p className="text-gray-800">{property.property_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Listing Status</p>
                    <p className="text-gray-800">{property.listing_status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bedrooms</p>
                    <p className="text-gray-800">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bathrooms</p>
                    <p className="text-gray-800">{property.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Parking Slots</p>
                    <p className="text-gray-800">{property.parking_slots}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Construction Area (m²)</p>
                    <p className="text-gray-800">{property.construction_area_sq_meters}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lot Area (m²)</p>
                    <p className="text-gray-800">{property.lot_area_sq_meters}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.gcs_image_urls && (property.gcs_image_urls as string[]).map((url, index) => (
                  <div key={index}>
                    <img src={`https://storage.googleapis.com/urbantia-living-public/${url}`} alt={`Property image ${index + 1}`} className="w-full h-auto rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
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
    return { notFound: true };
  }
};

export default ViewPropertyPage;