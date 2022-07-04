/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

module.exports = { 
	...nextConfig,
	async redirects() {
		return [
			{
				source: "/boards",
				destination: "/profile",
				permanent: true
			}
		]
	}
 }
