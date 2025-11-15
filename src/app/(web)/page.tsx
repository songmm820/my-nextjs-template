'use client'

import { SessionProvider } from 'next-auth/react'
import Client from './Client'


export default function HomePage() {
    return (
        <SessionProvider>
            <Client />
        </SessionProvider>
    )
}
