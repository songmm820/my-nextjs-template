'use client'

import PageContainer from '~/shared/components/PageContainer'
import Avatar from '~/shared/components/Avatar'
import { useLoginUser } from '~/context/LoginUserProvider'

const MySettingPage = () => {
  const { user } = useLoginUser()

  return (
    <PageContainer>
      <div className="w-full">
        <div className="w-full text-center text-2xl font-medium">My Setting</div>
        <div className="w-full mt-4 flex justify-center">
          {user && <Avatar src={user?.avatar} size={100} />}
        </div>
      </div>
    </PageContainer>
  )
}

export default MySettingPage
