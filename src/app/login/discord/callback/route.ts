import { cookies, headers } from "next/headers";

import type { NextRequest } from "next/server";
import { getMember, getToken } from "@/lib/discord";
import prismaClient from "@/lib/prisma";
import OAuth from "discord-oauth2";
import { getIronSession } from "iron-session";
import { SessionData, generateExpiry, sessionOptions } from "@/lib/session";

export const GET = async (request: NextRequest) => {
	const storedState = cookies().get("discord_oauth_state")?.value;
	const url = new URL(request.url);
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const token = await getToken(code);
		const member = await getMember(token.access_token) as OAuth.Member;

		// Create or update user in database
		const user = await prismaClient.user.upsert({
			where: {
				discord_id: member.user!.id
			},
			update: {
				username: member.user!.username
			},
			create: {
				discord_id: member.user!.id,
				username: member.user!.username
			}
		});

		// create session object for user and store in database
		const session = await getIronSession<SessionData>(cookies(), sessionOptions);

		session.isLoggedIn = true;
		session.username = user.username;
		session.expiresAt = generateExpiry();

		await session.save();

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/" // redirect to home page
			}
		});
	} catch (e) {
		console.error(e);

		// internal server error
		return new Response(null, {
			status: 500
		});
	}
};