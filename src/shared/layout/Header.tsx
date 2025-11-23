'use client'

import Image from 'next/image'
import { useAuth } from '~/shared/context/auth-provider'

const Header = () => {
    const { avatar } = useAuth()

    return (
        <div className="h-16 flex items-center px-6 bg-[rgba(255,255,255,0.98)] shadow-[rgba(0,0,0,0.07)_0px_4px_8px_0px]">
            <div className='flex-1'></div>
            <div>{avatar && <Image className='rounded-full' src={avatar} width={48} height={48} alt="" />}</div>
        </div>
    )
}

export default Header
