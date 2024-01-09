import { generateAuthUrl } from "@/lib/discord";
import * as context from "next/headers";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
	// More about state: https://auth0.com/docs/protocols/state-parameters
	const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

	const url = generateAuthUrl(state);

	// store state in cookie
	context.cookies().set("discord_oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 60
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url
		}
	});
};