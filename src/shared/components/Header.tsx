'use client'

import { useEffect } from 'react'
import { type NavRouteHrefType } from '~/shared/constants'
import clsx from 'clsx'
import { useAuthGuard } from '~/context/AuthGuardProvider'
import { useLoginUser } from '~/context/LoginUserProvider'
import Avatar from '~/shared/components/Avatar'
import { CustomLink } from '~/shared/components/CustomLink'
import { usePathname } from 'next/navigation'
import { Button, Input } from '~/shared/features'

const NAV_LINKS: Array<NavLinkType> = [
  {
    link: '/home',
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
        <div className="mx-6">
          <GlobalSearchInput />
        </div>
        <CreationCenterButton />
        <div className="mx-4 w-8 h-8">
          {user && <Avatar name={user?.name} src={user?.avatar} size={36} />}
        </div>
        <button className="text-md text-666 hover:text-gray-900" onClick={onSignOut}>
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
          className={clsx('text-base text-666 hover:text-primary/90 relative', {
            'text-primary/80': avtiveLink === it.link,
            "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary/50 after:transition-all after:duration-300 hover:after:w-1/2": true
          })}
        >
          {it.label}
        </CustomLink>
      ))}
    </div>
  )
}

const CreationCenterButton = () => {
  return (
    <Button className="rounded-3xl h-9 bg-primary/90" variant="primary">
      <span className="text-md">Creation Center</span>
    </Button>
  )
}

const GlobalSearchInput = () => {
  return (
    <Input
      className="rounded-3xl h-9 w-80"
      placeholder="Search for articles, topics, and users .."
    />
  )
}

export default Header
