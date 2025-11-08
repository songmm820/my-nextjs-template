/**
 * Next.js可以静态键入链接，以防止使用时出现拼写错误和其他错误，从而提高页面之间导航时的类型安全性。
 * 
 * @see https://nextjs.org/docs/app/api-reference/config/typescript#statically-typed-links
 */

import type { Route } from 'next'

type NavItem<T extends string = string> = {
    href: T
    label: string
}

export const navItems: NavItem<Route>[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
]
