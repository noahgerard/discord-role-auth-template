"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server';

import prismaClient from "@/lib/prisma";
import { SessionData, defaultSession, sessionOptions } from "@/lib/session";

// Get user session
export async function GET() {
	console.log("GET /api/user/");
	const session = await getIronSession<SessionData>(cookies(), sessionOptions);

	// Get user from database with matching session
	const user = await prismaClient.user.findFirst({
		where: { sessions: { some: { id: session.id } } },
	});

	// If user not found, destroy session and return default session
	if (!user) {
		session.destroy();
		return NextResponse.json(defaultSession, { status: 401 });
	}

	// Update session data
	session.roles = user?.roles || [];
	session.username = user?.username || "";
	await session.save();

	// If session has expired, return default session
	if (session.expiresAt < Date.now()) {
		return NextResponse.json(defaultSession, { status: 401 });
	}

	return NextResponse.json(session);
}

// Delete user session/Logout
export async function DELETE() {
	console.log("DELETE /api/user/");
	const session = await getIronSession<SessionData>(cookies(), sessionOptions);
	
	// Delete session from database
	try {
		await prismaClient.session.delete({
			where: { id: session.id }
		});

		// Destroy session
		session.destroy();
	} catch (error) {
		console.error("Error deleting session", error);
		return NextResponse.json({ error: "Error deleting session" }, { status: 500 });
	}

	return NextResponse.json(defaultSession);
}