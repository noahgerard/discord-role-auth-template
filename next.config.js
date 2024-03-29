/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		GUILD_ID: process.env.GUILD_ID,
		ROLE_ID: process.env.NEXT_PUBLIC_ROLE_ID,
		CLIENT_ID: process.env.CLIENT_ID,
	}
}

module.exports = nextConfig
