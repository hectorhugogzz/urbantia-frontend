// src/components/properties/PropertyTable.tsx

import React from 'react';
import Link from 'next/link';
import { Property } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

interface PropertyTableProps {
  properties: Property[];
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties }) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <h2 className="text-xl font-semibold">No Properties Found</h2>
        <p className="mt-2">Get started by adding a new property.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (MXN)</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/properties/view/${property.id}`} legacyBehavior>
                  <a className="text-sm font-medium text-gray-900 hover:text-indigo-600">{property.property_name}</a>
                </Link>
                <div className="text-sm text-gray-500">{property.property_type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.listing_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.location_zone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{formatCurrency(property.price_mxn)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(property.listing_status)}`}>
                  {property.listing_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-4">
                  <Link href={`/properties/${property.id}`} legacyBehavior>
                    <a className="text-indigo-600 hover:text-indigo-900" title="Edit Property">
                      <Edit className="h-5 w-5" />
                    </a>
                  </Link>
                  <button
                    onClick={() => alert(`Delete action for property ID: ${property.id}. Functionality to be added.`)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Property"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;