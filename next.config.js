 /** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            'files.oaiusercontent.com',
            'cdn.igp.com',
            'cdn.leonardo.ai',
            'example.com',
            'media-assets.swiggy.com',
            'bromabakery.com',
            'th.bing.com',
            'cdn.myshopmatic.com',
            'sugargeekshow.com' // Add this line
        ],
    },
    // ... other configurations ...
}

module.exports = nextConfig;