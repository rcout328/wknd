 /** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['files.oaiusercontent.com', 'cdn.igp.com','cdn.leonardo.ai'], // Add the new hostname here
    },
    // ... other configurations ...
}

module.exports = nextConfig;