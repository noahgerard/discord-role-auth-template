"use client";

const LogoutButton = () => {
  const logout = async () => {
    const response = await fetch("/api/session/", {
      method: "DELETE",
    });

    if (response.ok) {
      location.reload();
    }
  };

  return (
    <button className='p-2 border-[1px] rounded-md' onClick={logout}>Logout</button>
  );
};

export default LogoutButton;