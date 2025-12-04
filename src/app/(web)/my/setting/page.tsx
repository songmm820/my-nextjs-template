'use client'

import clsx from 'clsx'
import PageContainer from '~/shared/components/PageContainer'
import Avatar from '~/shared/components/Avatar'
import { useLoginUser } from '~/context/LoginUserProvider'
import ThemeColorPicker from '~/shared/components/ThemeColorPicker'
import { useTheme } from '~/context/ThemeProvider'
import { type ThemeColorType } from '~/shared/constants'
import { Radio, type RadioOptionItemType } from '~/shared/features'
import { DynamicPermissionEnum, VisibilityLevelEnum } from '~/generated/prisma/enums'

const MySettingPage = () => {
  const { user } = useLoginUser()

  return (
    <PageContainer>
      <div
        className={clsx(
          'w-full h-full flex flex-col items-center py-6 rounded-2xl',
          'bg-linear-to-br from-primary/5 to-white',
          'border-2 border-white'
        )}
      >
        <div className="w-full text-center text-3xl font-medium">My Setting</div>
        <div className="w-160 mt-4 flex flex-col">
          <div className="w-full flex justify-center">
            <div className="w-[150px] h-[150px]">
              {user && <Avatar src={user?.avatar} size={150} />}
            </div>
          </div>
          <div className='flex flex-col gap-6'>
            <ThemeColorSetting />
            <ProfileVisibilitySetting />
            <CommentPermissionSetting />
            <MessagePermissionSetting />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

const ThemeColorSetting = () => {
  const { themeColor, setThemeColor } = useTheme()

  const handleThemeColorChange = (color: ThemeColorType) => {
    setThemeColor(color)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl font-medium">Theme Color</div>
      <ThemeColorPicker color={themeColor} onChange={handleThemeColorChange} />
    </div>
  )
}

const VisibilityLevelEnumObjInfo = {
  [VisibilityLevelEnum.PUBLIC]: {
    label: 'Public',
    description: 'Anyone One'
  },
  [VisibilityLevelEnum.PRIVATE]: {
    label: 'Private',
    description: 'Only You'
  },
  [VisibilityLevelEnum.FOLLOWERS]: {
    label: 'Followers',
    description: 'Only Your Followers'
  }
}

const ProfileVisibilitySetting = () => {
  const { config } = useLoginUser()
  const current = config?.profileVisibility

  const options: Array<RadioOptionItemType> = Object.entries(VisibilityLevelEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
      description: value.description,
      value: key as VisibilityLevelEnum
    })
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl font-medium">Profile Visibility</div>
      <Radio value={current} options={options} />
    </div>
  )
}

const DynamicPermissionEnumObjInfo = {
  [DynamicPermissionEnum.ALL]: {
    label: 'All',
    description: 'Anyone One'
  },
  [DynamicPermissionEnum.FOLLOWERS]: {
    label: 'Followers',
    description: 'Only Your Followers'
  },
  [DynamicPermissionEnum.SELF]: {
    label: 'Self',
    description: 'Only You'
  }
}

const CommentPermissionSetting = () => {
  const { config } = useLoginUser()
  const current = config?.whoCanComment

  const options: Array<RadioOptionItemType> = Object.entries(DynamicPermissionEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
      description: value.description,
      value: key as DynamicPermissionEnum
    })
  )

  return (
    <div className=" flex flex-col gap-3">
      <div className="text-xl font-medium">Who Can Comment</div>
      <Radio value={current} options={options} />
    </div>
  )
}

const MessagePermissionSetting = () => {
  const { config } = useLoginUser()
  const current = config?.whoCanMessage

  const options: Array<RadioOptionItemType> = Object.entries(DynamicPermissionEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
      description: value.description,
      value: key as VisibilityLevelEnum
    })
  )

  return (
    <div className=" flex flex-col gap-3">
      <div className="text-xl font-medium">Who Can Message</div>
      <Radio value={current} options={options} />
    </div>
  )
}

export default MySettingPage
