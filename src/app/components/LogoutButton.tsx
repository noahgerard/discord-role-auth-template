"use client";

import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const logout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
      redirect: "manual"
    });

    if (response.status === 0) {
      // redirected
      // when using `redirect: "manual"`, response status 0 is returned
      return router.refresh();
    }
  };

  return (
    <button className='p-2 border-[1px] rounded-md' onClick={logout}>Logout</button>
  );
};

export default LogoutButton;