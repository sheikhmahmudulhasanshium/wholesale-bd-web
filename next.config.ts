import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [25, 50, 75],
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },{
        protocol: 'https',
        hostname: 'picsum.photos'
      }
    ]
  },
  
};

export default nextConfig;
