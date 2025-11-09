'use client'

import { SessionProvider } from 'next-auth/react'
import Client from './client'


export default function HomePage() {
    return (
        <SessionProvider>
            <Client />
        </SessionProvider>
    )
}
