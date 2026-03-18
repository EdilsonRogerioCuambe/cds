/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // Allow Next.js Image component to serve local uploaded images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Allow images from the local uploads folder (served as /uploads/*)
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },

  // Ensure the API route for videos can handle large files
  api: {
    bodyParser: {
      sizeLimit: "500mb",
    },
    responseLimit: false,
  },
}

export default nextConfig
