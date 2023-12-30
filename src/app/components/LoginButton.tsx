"use client";

import { useRouter } from 'next/navigation';

const LoginButton = () => {
  const router = useRouter();

  const login = async () => {
    router.replace("/login/discord")
  }

  return (
    <button className='p-2 border-[1px] rounded-md' onClick={login}>Login with Discord</button>
  );
};

export default LoginButton;