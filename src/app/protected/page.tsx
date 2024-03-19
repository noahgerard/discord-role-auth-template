import { Suspense } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getIronSession } from "iron-session";

import { SessionData, sessionOptions } from "@/lib/session";

// Broken: None of these parameters is working, thus we have caching issues
// TODO fix this
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  return session;
}

export default function ProtectedServer() {
  return (
    <main className="space-y-5">
      <title>Protected Page</title>
      <Suspense fallback={<p className="text-lg">Loading...</p>}>
        <Content />
      </Suspense>
      <p>
        <Link
          href="/"
        >
          ← Back
        </Link>
      </p>
    </main>
  );
}

async function Content() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.roles.includes(process.env.ROLE_ID as string)) {
    return <Restricted />;
  }

  return (
    <div className="max-w-xl space-y-2">
      <p>
        Hello <strong>{session.username}!</strong>
      </p>
      <p>
        This page is protected and can only be accessed if you are logged in and have the correct role.
        Otherwise you will be redirected to the login page.
      </p>
      <p>The check is done via a server component.</p>
    </div>
  );
}

function Restricted() {
  return (
    <div className="max-w-xl space-y-2">
      <p>
        You are not allowed to access this page.
      </p>
    </div>
  );
}