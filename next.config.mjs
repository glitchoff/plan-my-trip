/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // unpotimzed

      {

        protocol: 'https',
        hostname: '*',
      },
    
    ],
  },
};

export default nextConfig;
