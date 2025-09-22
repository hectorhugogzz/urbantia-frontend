// src/libs/gcs.ts

import { Storage } from '@google-cloud/storage';

// Initialize the GCS storage client.
// In a GCP environment (like Cloud Run or a GCE VM), the library
// automatically authenticates using the instance's service account.
// No need to manage key files in your code.
const storage = new Storage();

// The name of your GCS bucket.
const BUCKET_NAME = 'ulp-assets';

/**
 * Generates a secure, short-lived URL that allows the client-side
 * to directly upload a file to GCS without needing credentials.
 *
 * @param {string} objectPath - The full path for the object in GCS,
 *                              including the directory and filename.
 *                              e.g., "property-123-Casa-de-Lujo/main-facade.jpg"
 * @param {string} contentType - The MIME type of the file to be uploaded,
 *                               e.g., "image/jpeg" or "application/pdf".
 * @returns {Promise<string>} A promise that resolves to the signed URL.
 */
export async function generateV4UploadSignedUrl(objectPath: string, contentType: string): Promise<string> {
  const options = {
    version: 'v4' as const,
    action: 'write' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  };

  // Get a v4 signed URL for uploading a file
  const [url] = await storage
    .bucket(BUCKET_NAME)
    .file(objectPath)
    .getSignedUrl(options);

  return url;
}

/**
 * Lists all public URLs for files within a specific directory (prefix) in the bucket.
 *
 * @param {string} directoryPath - The directory path to list files from.
 *                                 e.g., "property-123-Casa-de-Lujo/"
 * @returns {Promise<string[]>} A promise that resolves to an array of public URLs.
 */
export async function listFilesByDirectory(directoryPath: string): Promise<string[]> {
  const [files] = await storage.bucket(BUCKET_NAME).getFiles({ prefix: directoryPath });

  // GCS file objects are not public by default, but since we set the bucket to public,
  // we can construct the public URL manually.
  return files.map(file => `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`);
}

/**
 * Deletes a file from the GCS bucket.
 *
 * @param {string} objectPath - The full path of the object to delete.
 * @returns {Promise<void>}
 */
export async function deleteFile(objectPath: string): Promise<void> {
  await storage.bucket(BUCKET_NAME).file(objectPath).delete();
}