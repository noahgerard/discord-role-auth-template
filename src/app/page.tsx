"use client";

import LogoutButton from '@/components/LogoutButton';
import LoginButton from '@/components/LoginButton';
import { useSession } from "./lib/hooks";

export default function Home() {
  //const authRequest = auth.handleRequest("GET", context);
  const session = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className='ml-auto w-fit flex flex-row items-center'>
          <p className='mx-2'>
            { session?.user?.isLoggedIn ? `Logged in as "${session?.user?.username}"` : ""}
          </p>

          { session?.user?.isLoggedIn ? JSON.stringify(session, null, 2) : ""}

          { session?.user?.isLoggedIn ? <LogoutButton /> : <LoginButton />}
        </div>

        {/* <div className='w-full rounded-md border-[1px] p-2 mb-2 relative'>{JSON.stringify(session, null, 2)}</div> */}
      </div>
    </main>
  )
}
