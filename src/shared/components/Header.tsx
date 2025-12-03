'use client'

import { useEffect } from 'react'
import { useAuthGuard } from '~/context/AuthGuardProvider'
import { useLoginUser } from '~/context/LoginUserProvider'
import Avatar from '~/shared/components/Avatar'

const Header = () => {
  const { onSignOut } = useAuthGuard()
  const { user } = useLoginUser()

  useEffect(() => {}, [])

  return (
    <header className="h-16 flex items-center px-6 backdrop-blur-md shadow-[rgba(0,0,0,0.07)_0px_4px_8px_0px]">
      <div className="flex-1">{JSON.stringify(user)}</div>
      <div className="flex">
        {user && <Avatar name={user?.name} src={user?.avatar} size={36} />}

        <button className="ml-4 text-sm text-666 hover:text-gray-900" onClick={onSignOut}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
