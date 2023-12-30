import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { discord } from "@lucia-auth/oauth/providers";

const client = new PrismaClient();

// expect error (see next section)
export const auth = lucia({
	env: "DEV", // "PROD" if deployed to HTTPS
	middleware: nextjs_future(), // NOT nextjs()
	sessionCookie: {
		expires: false
	},
	adapter: prisma(client, {
		user: "user", // model User {}
		key: "key", // model Key {}
		session: "session" // model Session {}
	}),
	getUserAttributes: (databaseUser) => {
		return {
			username: databaseUser.username
		};
	}
});

export const discordAuth = discord(auth, {
	clientId: process.env.CLIENT_ID as string,
	clientSecret: process.env.CLIENT_SECRET as string,
	redirectUri: process.env.REDIRECT_URI as string,
	scope: ["identify", "email", "guilds"]
})

// TODO: fix scope

export type Auth = typeof auth;