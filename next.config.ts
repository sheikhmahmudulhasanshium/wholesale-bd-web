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
      },
      {
        protocol: 'https',
        hostname: 'pub-1508a97a3d584140a7f32f1ca90490c2.r2.dev',

      },
      {
        protocol: 'https',
        hostname: 'www.deccanchronicle.com',

      }
      ,
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',

      },{
        protocol: 'https',
        hostname: 'png.pngtree.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.clickbd.com',
        port: '',
        pathname: '/**',
      },
    ]
  },
  
};

export default nextConfig;
