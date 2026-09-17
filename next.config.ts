// import createMDX from '@next/mdx';
import { createContentlayerPlugin } from 'next-contentlayer2';

const nextConfig = {
  // pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  webpack: (config: { cache: boolean }) => {
    config.cache = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/docs/kurser/lou-grundkurs/10-slutprov',
        destination: '/docs/kurser/lou-grundkurs/10-modellosning',
        permanent: true,
      },
    ];
  },
};

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
});

export default withContentlayer(nextConfig);
