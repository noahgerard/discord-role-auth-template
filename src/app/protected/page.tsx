import { Suspense, useEffect } from "react";

import { cookies } from "next/headers";
import Link from "next/link";
import { IronSession, getIronSession } from "iron-session";

import { SessionData, sessionOptions } from "@/lib/session";
import axios from "axios";
import { useSession } from "@/lib/hooks";

// Broken: None of these parameters is working, thus we have caching issues
// TODO fix this
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  console.log("getSession", session);

  return session;
}

export default function ProtectedServer() {
  return (
    <div className="space-y-5">
      <title>Protected Page</title>
      <Suspense fallback={<p className="text-lg">Loading...</p>}>
        <Content />
      </Suspense>
      <Link href="/" className="text-blue-500" >
        ← Back
      </Link>
    </div>
  );
}

async function Content() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return <></>
  }

  if (!session.roles.includes(process.env.ROLE_ID as string)) {
    return (
      <div className="flex flex-col gap-2">
        <div>
        <h3 className="text-bold">Your Roles</h3>
        <ul>
          {session.roles.map((role, i) => (
            <li key={i}>{role}</li>
          ))}
        </ul>
      </div>

        <p>
          You are not allowed to access this page.
        </p>

        <p>
          Role needed to access protected page: <strong>{process.env.ROLE_ID}</strong>
        </p>

        <p>
          Join the <Link href="/" className="text-blue-500">
            test server
          </Link> and assign yourself the role!
        </p>

      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-xl gap-2">
      <div>
        <h3 className="text-bold">Your Roles</h3>
        <ul>
          {session.roles.map((role, i) => (
            <li key={i}>{role}</li>
          ))}
        </ul>
      </div>

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

function NotLoggedIn() {
  return (
    <div className="flex flex-col max-w-xl gap-2">
      <p>
        You are not logged in.
      </p>
    </div>
  );
}