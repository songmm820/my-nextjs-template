'use client'

import { useEffect } from 'react'
import { useAuthGuard } from '~/context/AuthGuardProvider'
import { useLoginUser } from '~/context/LoginUserProvider'
import Avatar from '~/shared/components/Avatar'
import { type NavRouteHrefType } from '~/shared/constants'
import { CustomLink } from './CustomLink'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

const NAV_LINKS: Array<NavLinkType> = [
  {
    link: '/',
    label: 'Home'
  },
  {
    link: '/about',
    label: 'My Posts'
  }
]

const Header = () => {
  const pathname = usePathname()
  const { onSignOut } = useAuthGuard()
  const { user } = useLoginUser()

  useEffect(() => {}, [])

  return (
    <header className="h-16 flex items-center px-6 backdrop-blur-md shadow-[rgba(0,0,0,0.07)_0px_4px_8px_0px]">
      <div className="flex-1 h-full">
        <NavLins links={NAV_LINKS} avtiveLink={pathname} />
      </div>
      <div className="flex">
        {user && <Avatar name={user?.name} src={user?.avatar} size={36} />}

        <button className="ml-4 text-md text-666 hover:text-gray-900" onClick={onSignOut}>
          Logout
        </button>
      </div>
    </header>
  )
}

type NavLinkType = {
  link: NavRouteHrefType
  label: string
}

type NavLinsProps = {
  links: Array<NavLinkType>
  avtiveLink: NavRouteHrefType | string
}

const NavLins = (props: NavLinsProps) => {
  const { links, avtiveLink } = props
  return (
    <div className="w-full h-full flex items-center gap-6">
      {links.map((it, i) => (
        <CustomLink
          key={i}
          href={it.link}
          className={clsx('text-md text-666 hover:text-primary relative', {
            'text-primary': avtiveLink === it.link,
            "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-1/2": true
          })}
        >
          {it.label}
        </CustomLink>
      ))}
    </div>
  )
}

export default Header
