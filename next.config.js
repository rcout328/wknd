 /** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['files.oaiusercontent.com', 'cdn.igp.com', 'cdn.leonardo.ai'], // Add any other domains you are using
    },
    // ... other configurations ...
}

module.exports = nextConfig;