"use client";

import LogoutButton from '@/components/LogoutButton';
import LoginButton from '@/components/LoginButton';
import { useSession } from "./lib/hooks";

export default function Home() {
  //const authRequest = auth.handleRequest("GET", context);
  const session = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full justify-between font-mono">
        <div className='flex w-full justify-between'>
          <p className='flex justify-center items-center'>
            {session?.user?.isLoggedIn ?
              <div className='flex items-center gap-2'>
                { session?.user?.avatar ? <img src={`https://cdn.discordapp.com/avatars/${session?.user.discordId}/${session?.user?.avatar}.png`} alt="avatar" className="w-8 h-8 rounded-full" /> : "" }
                { session?.user?.username }
              </div>
              : ""}
          </p>

          {session?.user?.isLoggedIn ? <LogoutButton /> : <LoginButton />}
        </div>
          
        <div className='w-full rounded-md p-2 mb-2 relative' style={{ whiteSpace: 'pre-wrap' }}>
          {session?.user?.isLoggedIn ? JSON.stringify(session, null, 2) : ""}
        </div>
      </div>
    </main>
  )
}
