'use server'

import { SessionProvider } from 'next-auth/react'
import Client from './client'
import { prisma } from '../../../prisma/prisma'

export default async function HomePage() {
    const resp = await prisma.sysUser.findMany()

    console.log(resp)

    return (
        <SessionProvider>
            <Client />
            {JSON.stringify(resp)}
        </SessionProvider>
    )
}
