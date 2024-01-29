"use server";

import prismaClient from "@/lib/prisma";
import { SessionData, defaultSession, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: Request) {
	console.log("GET /api/user/");
	const session = await getIronSession<SessionData>(cookies(), sessionOptions);

	// Get user from database with matching session
	const user = await prismaClient.user.findFirst({
		where: { sessions: { some: { id: session.id } } },
	});

	// Update session data
	session.roles = user?.roles || [];
	session.save();

	// If session has expired, return default session
	if (session.expiresAt < Date.now()) {
		return NextResponse.json(defaultSession, { status: 401 });
	}

	return NextResponse.json(session);
}

// Logout
export async function DELETE(req: NextRequest) {
	console.log("DELETE /api/user/");
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

	// Delete session from database
	await prismaClient.session.delete({
		where: { id: session.id }
	});

	// Destroy session
  session.destroy();

	return NextResponse.json(defaultSession);
}