// pages/api/properties/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/libs/prisma';
import { Property } from '@/types';

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Property | { message: string } | ErrorResponse>
) {
  // Extract the property ID from the URL query string.
  const { id } = req.query;
  const propertyId = Number(id);

  // Validate that the ID is a valid number.
  if (isNaN(propertyId)) {
    return res.status(400).json({ error: 'Invalid property ID.' });
  }
  
  // TODO: Add authentication and authorization logic here later.

  switch (req.method) {
    case 'GET':
      try {
        const property = await prisma.properties.findUnique({
          where: { id: propertyId },
        });

        if (!property) {
          return res.status(404).json({ error: 'Property not found.' });
        }

        return res.status(200).json(property);
      } catch (error) {
        console.error(`Failed to retrieve property ${propertyId}:`, error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'PUT':
      try {
        const updatedData = req.body;
        
        // The 'updated_at' field can be automatically handled by the database
        // or set here if needed. For simplicity, we let Prisma manage it.
        const updatedProperty = await prisma.properties.update({
          where: { id: propertyId },
          data: updatedData,
        });

        return res.status(200).json(updatedProperty);
      } catch (error) {
        console.error(`Failed to update property ${propertyId}:`, error);
        // Prisma's P2025 code means "Record to update not found."
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Property not found.' });
        }
        return res.status(500).json({ error: 'Failed to update property.' });
      }

    case 'DELETE':
      try {
        await prisma.properties.delete({
          where: { id: propertyId },
        });

        return res.status(200).json({ message: `Property ${propertyId} deleted successfully.` });
      } catch (error) {
        console.error(`Failed to delete property ${propertyId}:`, error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Property not found.' });
        }
        return res.status(500).json({ error: 'Failed to delete property.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}