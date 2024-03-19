"use client";

import { useSession } from "@/lib/hooks";

export default function Home() {
  const session = useSession();

  return (
    <div className='w-full rounded-md p-2 mb-2 relative' style={{ whiteSpace: 'pre-wrap' }}>
      {session?.user?.isLoggedIn ? JSON.stringify(session, null, 2) : ""}
    </div>
  )
}
