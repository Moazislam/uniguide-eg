import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Add your Supabase storage bucket hostname here when you upload logos/covers:
      // { protocol: "https", hostname: "qeoxjzcjkazyjikhvnab.supabase.co" },
    ],
  },
};

export default nextConfig;
