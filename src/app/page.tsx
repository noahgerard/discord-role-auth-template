"use client";

import { useSession } from "@/lib/hooks";
import Link from "next/link";

export default function Home() {
  const session = useSession();

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div>
        <h3 className="text-bold">Your Roles</h3>
        <ul>
          {session?.user?.roles?.map((role: string, i: number) => (
            <li key={i}>{role}</li>
          ))}
        </ul>
      </div>

      <div>
        <Link href="/protected" className="text-blue-500">
          Go to protected page ➡️
        </Link>
      </div>
    </div>
  )
}
