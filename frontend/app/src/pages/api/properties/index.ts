// pages/api/properties/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/libs/prisma';
import { Property } from '@/types';

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Property[] | Property | ErrorResponse>
) {
  // TODO: Add authentication and authorization logic here later.

  switch (req.method) {
    case 'GET':
      try {
        const properties = await prisma.properties.findMany({
          orderBy: {
            created_at: 'desc', // Return the newest properties first
          },
        });
        return res.status(200).json(properties);
      } catch (error) {
        console.error('Failed to retrieve properties:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    case 'POST':
      try {
        const newPropertyData = req.body;

        // Basic validation: ensure essential fields are present
        if (!newPropertyData.property_name || !newPropertyData.price_mxn) {
          return res.status(400).json({ error: 'Property Name and Price are required.' });
        }
        
        // Prisma will automatically handle the creation and return the new record.
        // It validates data types against the schema.
        const createdProperty = await prisma.properties.create({
          data: newPropertyData,
        });

        return res.status(201).json(createdProperty); // 201 Created
      } catch (error) {
        console.error('Failed to create property:', error);
        // Check for Prisma-specific validation errors
        if (error.code === 'P2002') { // Unique constraint failed
          return res.status(409).json({ error: 'A property with this Listing ID already exists.' });
        }
        return res.status(500).json({ error: 'Failed to create property.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}