'use client'

import { signIn, useSession } from 'next-auth/react'

const Client = () => {
    const { data: session } = useSession()
    return (
        <div className="w-full h-full flex justify-center p-20">
            {session && <img src={session?.user?.image} width={300} height={300} />}

            <button onClick={() => signIn('github')}>登录</button>
        </div>
    )
}

export default Client
