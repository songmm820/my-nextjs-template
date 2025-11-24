'use client'

import { useEffect } from 'react'

const Header = () => {
    useEffect(() => {}, [])

    return (
        <div className="h-16 flex items-center px-6 bg-[rgba(255,255,255,0.98)] shadow-[rgba(0,0,0,0.07)_0px_4px_8px_0px]">
            <div className="flex-1"></div>
            <div>
                <button className="ml-4 text-sm text-gray-600 hover:text-gray-900">Login</button>
                <button className="ml-4 text-sm text-gray-600 hover:text-gray-900">Logout</button>
            </div>
        </div>
    )
}

export default Header
