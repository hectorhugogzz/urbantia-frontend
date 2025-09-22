/** @type {import('next').NextConfig} */
const nextConfig = {
  // This option creates a 'standalone' folder which copies only the necessary
  // files for a production deployment, drastically reducing image size.
  output: 'standalone',
};

export default nextConfig;