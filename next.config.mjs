/** @type {import('next').NextConfig} */
const nextConfig = {
  // SECURITY: Do NOT set ignoreBuildErrors — TypeScript errors can mask security issues
  images: {
    unoptimized: true,
  },
  // Security headers as fallback (middleware handles primary security headers)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
  // Disable powered-by header to reduce information disclosure
  poweredByHeader: false,
}

export default nextConfig
