'use client'

import { useLinkStatus } from 'next/link'
const Leading = () => {
  const { pending } = useLinkStatus()
  return <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
}

export default Leading
