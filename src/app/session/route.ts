import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, defaultSession, generateExpiry, sessionOptions } from "@/lib/session";
import prismaClient from "@/lib/prisma";


// Create a new session
/* export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // lookup session in db

  const body = await request.json() as { username: string };

  session.isLoggedIn = true;
  session.username = body.username ?? "No u";
  session.expiresAt = generateExpiry();

  await session.save();


  return Response.json(session);
} */

// Get current session data
export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // lookup user in db
  const user = await prismaClient.user.findFirst({
    where: {
      sessions: {
        some: {
          id: session.id
        }
      }
    }
  });

  if (!user || session.isLoggedIn !== true || session.expiresAt < Date.now()) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

// Logout/destroy a session
export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  session.destroy();

  return Response.json(defaultSession);
}