import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import LogoutButton from '@/components/LogoutButton';
import LoginButton from '@/components/LoginButton';

export default async function Home() {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className='ml-auto w-fit flex flex-row items-center'>
          <p className='mx-2'>
            {session ? `Logged in as "${session.user.username}"` : ""}
          </p>

          { session ? JSON.stringify(session, null, 2) : ""}

          {session ? <LogoutButton /> : <LoginButton />}
        </div>

        {/* <div className='w-full rounded-md border-[1px] p-2 mb-2 relative'>{JSON.stringify(session, null, 2)}</div> */}
      </div>
    </main>
  )
}
