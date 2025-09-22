// pages/properties/new.tsx

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Header } from '@/components/Header';
import { Panel } from '@/components/Panel';
import PropertyForm from '@/components/PropertyForm';
import { Property } from '@/types';

const NewPropertyPage: NextPage = () => {
  const router = useRouter();

  /**
   * Handles the submission of the new property form.
   * This function will be passed to the reusable PropertyForm component.
   * @param propertyData - The form data for the new property.
   */
  const handleCreateProperty = async (propertyData: Partial<Property>) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create property');
      }

      // If creation is successful, redirect the user back to the main properties list.
      await router.push('/properties');

    } catch (error) {
      console.error('Submission error:', error);
      // In a real app, you would show a user-friendly error message here (e.g., a toast notification).
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
              Add New Property
            </h1>
            <p className="text-gray-600 mt-1">
              Fill in the details below to add a new listing to the catalog.
            </p>
          </div>

          {/* 
            Render the reusable form component.
            - We pass the save handler for the "create" action.
            - We don't pass any initialData because it's a new record.
          */}
          <PropertyForm onSave={handleCreateProperty} />

        </Panel>
      </main>
    </>
  );
};

export default NewPropertyPage;