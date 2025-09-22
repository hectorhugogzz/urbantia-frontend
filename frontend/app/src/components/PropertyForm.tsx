// src/components/properties/PropertyForm.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Property } from '../../types';

interface PropertyFormProps {
  initialData?: Property; // Optional: for editing existing properties
  onSave: (data: Partial<Property>) => Promise<void>;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSave }) => {
  // Initialize form state with initialData or a default empty object
  const [formData, setFormData] = useState<Partial<Property>>(initialData || {});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // A generic handler for most input types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Handle checkboxes for boolean values
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // Handle numeric fields
      const numericFields = ['price_mxn', 'lot_area_sq_meters', 'construction_area_sq_meters', 'bedrooms', 'bathrooms', 'parking_slots', 'stories'];
      if (numericFields.includes(name) && value !== '') {
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  // Helper styles for form elements to reduce repetition
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700";
  const sectionClass = "grid grid-cols-1 md:grid-cols-2 gap-6";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* --- Section 1: Core Information --- */}
      <div className={sectionClass}>
        <div>
          <label htmlFor="property_name" className={labelClass}>Property Name</label>
          <input type="text" name="property_name" id="property_name" value={formData.property_name || ''} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="listing_id" className={labelClass}>Listing ID (e.g., PUE-LOM-005)</label>
          <input type="text" name="listing_id" id="listing_id" value={formData.listing_id || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea name="description" id="description" rows={4} value={formData.description || ''} onChange={handleChange} className={inputClass}></textarea>
        </div>
        <div>
          <label htmlFor="property_type" className={labelClass}>Property Type</label>
          <select name="property_type" id="property_type" value={formData.property_type || ''} onChange={handleChange} className={inputClass}>
            <option value="">Select a type</option>
            <option value="house">House</option>
            <option value="department">Department</option>
            <option value="townhouse">Townhouse</option>
            <option value="lot">Lot</option>
          </select>
        </div>
        <div>
          <label htmlFor="listing_status" className={labelClass}>Listing Status</label>
          <select name="listing_status" id="listing_status" value={formData.listing_status || ''} onChange={handleChange} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* --- Section 2: Details & Features --- */}
      <div className={sectionClass}>
         <div>
            <label htmlFor="price_mxn" className={labelClass}>Price (MXN)</label>
            <input type="number" name="price_mxn" id="price_mxn" value={formData.price_mxn || ''} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
            <label htmlFor="bedrooms" className={labelClass}>Bedrooms</label>
            <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms || ''} onChange={handleChange} className={inputClass} />
        </div>
         <div>
            <label htmlFor="bathrooms" className={labelClass}>Bathrooms</label>
            <input type="number" name="bathrooms" id="bathrooms" step="0.5" value={formData.bathrooms || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
            <label htmlFor="parking_slots" className={labelClass}>Parking Slots</label>
            <input type="number" name="parking_slots" id="parking_slots" value={formData.parking_slots || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
            <label htmlFor="construction_area_sq_meters" className={labelClass}>Construction Area (m²)</label>
            <input type="number" name="construction_area_sq_meters" id="construction_area_sq_meters" value={formData.construction_area_sq_meters || ''} onChange={handleChange} className={inputClass} />
        </div>
        <div>
            <label htmlFor="lot_area_sq_meters" className={labelClass}>Lot Area (m²)</label>
            <input type="number" name="lot_area_sq_meters" id="lot_area_sq_meters" value={formData.lot_area_sq_meters || ''} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      
      {/* --- Section 3: Feature Flags --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
                <input id="has_pool" name="has_pool" type="checkbox" checked={formData.has_pool || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="has_pool" className="ml-2 block text-sm text-gray-900">Private Pool</label>
            </div>
             <div className="flex items-center">
                <input id="has_patio" name="has_patio" type="checkbox" checked={formData.has_patio || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="has_patio" className="ml-2 block text-sm text-gray-900">Patio / Garden</label>
            </div>
            <div className="flex items-center">
                <input id="has_roof_garden" name="has_roof_garden" type="checkbox" checked={formData.has_roof_garden || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="has_roof_garden" className="ml-2 block text-sm text-gray-900">Roof Garden</label>
            </div>
            <div className="flex items-center">
                <input id="studio" name="studio" type="checkbox" checked={formData.studio || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="studio" className="ml-2 block text-sm text-gray-900">Studio / Office</label>
            </div>
        </div>

      {/* --- Form Actions --- */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button type="button" onClick={() => router.back()} disabled={isLoading} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Saving...' : 'Save Property'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;