import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import OAuth from "discord-oauth2";
import { getIronSession } from "iron-session";

import { getMember, getToken } from "@/lib/discord";
import prismaClient from "@/lib/prisma";
import { SessionData, generateExpiry, generateId, sessionOptions } from "@/lib/session";

// OAuth callback
export const GET = async (request: NextRequest) => {
	const storedState = cookies().get("discord_oauth_state")?.value;
	const url = new URL(request.url);
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");

	// Check if state is valid
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const token = await getToken(code);
		const member = await getMember(token.access_token) as OAuth.Member;
		const session = await getIronSession<SessionData>(cookies(), sessionOptions);

		// Overwrite session data
		session.id = session.id || generateId();
		session.discordId = member.user!.id;
		session.username = member.user!.username;
		session.roles = member.roles;
		session.expiresAt = generateExpiry();
		session.isLoggedIn = true;
		session.avatar = member.user!.avatar || null;

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

		// Create or update user in database
		await prismaClient.user.upsert({
			where: { discord_id: member.user!.id },
			update: {
				username: member.user!.username,
				roles: member.roles,
				sessions: sessionCreate
			},
			create: {
				discord_id: member.user!.id,
				username: member.user!.username,
				roles: member.roles,
				sessions: sessionCreate
			}
		});

		await session.save();

		return new Response(null, {
			status: 302,
			headers: { Location: "/" }
		});
	} catch (e) {
		console.error(e);
		
		return new Response(null, {
			status: 500
		});
	}
};