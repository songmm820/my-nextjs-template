'use client'

import { useEffect } from 'react'
import { useAuthGuard } from '~/context/AuthGuardProvider'

const Header = () => {
  const { onSignOut } = useAuthGuard()

  useEffect(() => {}, [])

  return (
    <header className="h-16 flex items-center px-6 bg-[#f5f5f7] shadow-[rgba(0,0,0,0.07)_0px_4px_8px_0px]">
      <div className="flex-1"></div>
      <div>
        <button className="ml-4 text-sm text-gray-600 hover:text-gray-900">Login</button>
        <button className="ml-4 text-sm text-gray-600 hover:text-gray-900" onClick={onSignOut}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
