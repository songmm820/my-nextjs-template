"use client";

import { signIn } from "next-auth/react";


export default function HomePage() {
  return (
    <div className="w-full h-full flex justify-center p-20">
      <button onClick={() => signIn("github")}>登录</button>
    </div>
  );
}
