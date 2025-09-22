// pages/api/gcs/generate-upload-url.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { generateV4UploadSignedUrl } from '../../../src/libs/gcs';

// Define the structure of the incoming request body for type safety.
type RequestBody = {
  fileName: string;
  contentType: string;
  directory: string; // e.g., "property-123-Casa-de-Lujo"
};

// Define the structure of a successful response.
type SuccessResponse = {
  uploadUrl: string;
  objectPath: string; // The full path where the object will be stored.
};

// Define the structure of an error response.
type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  // This endpoint only accepts POST requests.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { fileName, contentType, directory } = req.body as RequestBody;

    // Basic validation to ensure we have the necessary information.
    if (!fileName || !contentType || !directory) {
      return res.status(400).json({
        error: 'Missing required fields. fileName, contentType, and directory are required.',
      });
    }

    // Sanitize inputs to prevent security issues like path traversal.
    // This replaces unsafe characters with a hyphen.
    const safeDirectory = directory.replace(/[^a-zA-Z0-9-_]/g, '-');
    const safeFileName = fileName.replace(/[^a-zA-Z0-9-._]/g, '-');
    const objectPath = `${safeDirectory}/${safeFileName}`;

    // Call our library function to get the secure URL from GCS.
    const uploadUrl = await generateV4UploadSignedUrl(objectPath, contentType);

    // Send the URL and the final object path back to the client.
    // The client will use 'uploadUrl' to perform the PUT request.
    // The client will use 'objectPath' to save the file's location to the database.
    return res.status(200).json({ uploadUrl, objectPath });

  } catch (error) {
    console.error('Error in generate-upload-url handler:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL.' });
  }
}