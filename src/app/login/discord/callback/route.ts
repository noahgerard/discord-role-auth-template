import { cookies } from "next/headers";

import type { NextRequest } from "next/server";
import { getMember, getToken } from "@/lib/discord";
import prismaClient from "@/lib/prisma";
import OAuth from "discord-oauth2";
import { getIronSession } from "iron-session";
import { SessionData, generateExpiry, generateId, sessionOptions } from "@/lib/session";

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

		// Get current session 
		const session = await getIronSession<SessionData>(cookies(), sessionOptions);

		// Generate new session data
		session.expiresAt = generateExpiry();
		session.id = session.id || generateId();
		session.isLoggedIn = true;

		// Session data structure for Prisma
		const sessionCreate = {
			connectOrCreate: {
				where: { id: session.id },
				create: {
					id: session.id,
					expires_at: new Date(session.expiresAt)
				}
			}
		};

		// Create or update user in database and 
		const user = await prismaClient.user.upsert({
			where: { discord_id: member.user!.id },
			update: {
				username: member.user!.username,
				sessions: sessionCreate
			},
			create: {
				discord_id: member.user!.id,
				username: member.user!.username,
				sessions: sessionCreate
			}
		});

		await session.save();

		// redirect to home page
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
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