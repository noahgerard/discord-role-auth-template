"use client";

import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const logout = async () => {
    console.log("logout");
    const response = await fetch("/api/session/", {
      method: "DELETE",
    });

    if (response.ok) {
      return router.refresh();
    }
  };

  return (
    <button className='p-2 border-[1px] rounded-md' onClick={logout}>Logout</button>
  );
};

export default LogoutButton;