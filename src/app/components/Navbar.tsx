"use client";

import { useMemo } from "react";
import Link from "next/link";

import { useSession } from "@/lib/hooks";
import LogoutButton from '@/components/LogoutButton';
import LoginButton from '@/components/LoginButton';

const Navbar = () => {
  const session = useSession();

  const profile = useMemo(() => {
    if (session?.user?.avatar) {
      return <img src={`https://cdn.discordapp.com/avatars/${session?.user.discordId}/${session?.user?.avatar}.png`} alt="avatar" className="w-8 h-8 rounded-full" />
    } else {
      return null;
    }
  }, [session]);

  return (
    <div className='flex w-full items-center justify-between border-2'>
      {session?.user?.isLoggedIn ?
        <div className='flex items-center gap-2'>
          {profile}
          <p>{session?.user?.username}</p>
        </div>
        : "Not logged in!"}

      <div>
        {session?.user?.isLoggedIn ? <LogoutButton /> : <LoginButton />}
      </div>
    </div>
  )
}

export default Navbar;