'use client'

import clsx from 'clsx'
import PageContainer from '~/shared/components/PageContainer'
import Avatar from '~/shared/components/Avatar'
import { useLoginUser } from '~/context/LoginUserProvider'
import ThemeColorPicker from '~/shared/components/ThemeColorPicker'
import { useTheme } from '~/context/ThemeProvider'
import { type ThemeColorType } from '~/shared/constants'
import { Button, Radio, type RadioOptionItemType } from '~/shared/features'
import { DynamicPermissionEnum, VisibilityLevelEnum } from '~/generated/prisma/enums'
import { useUpdateUserConfigSwrApi, useUserDailyCheckInSwrApi } from '~/apis/user-api'
import { toast } from 'sonner'

const MySettingPage = () => {
  return (
    <PageContainer>
      <div className={clsx('w-full flex flex-col items-center py-6 rounded-2xl bg-white')}>
        <div className="w-160 flex flex-col gap-3">
          <MyProfileSetting />
          <div className="mt-6 flex flex-col gap-6">
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

const LevelExp = () => {
  const { growthValue, isTodaySigned, setGrowthValue,setTodaySigned } = useLoginUser()
  const { trigger } = useUserDailyCheckInSwrApi()

  const handleCheckIn = async () => {
    if (isTodaySigned) {
      toast.warning('You have already checked in today,  please come back tomorrow.')
      return
    }
    const { data, error } = await trigger()
    if (!error) {
      setTodaySigned(true)
      setGrowthValue(data)
    }
  }

  return (
    <div className="bg-primary/2 px-4 pt-2 pb-3 rounded-md">
      <div className="flex items-center justify-between">
        <div className="text-999 text-md">
          <span>
            {growthValue?.exp} / {growthValue?.maxExp}
          </span>
        </div>
      </div>
      <div className="mt-2 w-full h-1.5 rounded-full bg-[#ededed]">
        {growthValue && (
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${(growthValue?.exp / growthValue?.maxExp) * 100}%` }}
          ></div>
        )}
      </div>
      <Button className="h-8 mt-4" block variant="outline" onClick={handleCheckIn}>
        {isTodaySigned ? 'Checked In' : 'Check In'}
      </Button>
    </div>
  )
}

const MyProfileSetting = () => {
  const { user, growthValue } = useLoginUser()
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl font-medium">My Profile</div>
      <div className="w-full flex items-center gap-6 h-40">
        <div className="w-[150px] h-[150px]">
          {user && <Avatar isSquare src={user?.avatar} size={150} />}
        </div>
        {user && (
          <div className="flex flex-col gap-2 justify-center w-52">
            <div className="mb-2 px-4">
              <div className="text-666 text-xl flex items-center">
                <div className="font-medium">{user?.name}</div>
                <div className="ml-3 bg-primary text-white text-sm rounded-full flex items-center justify-center px-1.5 min-w-5 h-5">
                  <span className="mr-0.5">Lv</span>
                  <span>{growthValue?.level}</span>
                </div>
              </div>
              <div className="text-666">{user?.email}</div>
            </div>
            <LevelExp />
          </div>
        )}
      </div>
    </div>
  )
}

const ThemeColorSetting = () => {
  const { themeColor, setThemeColor } = useTheme()
  const { trigger } = useUpdateUserConfigSwrApi()

  const handleThemeColorChange = async (color: ThemeColorType) => {
    setThemeColor(color)
    await trigger({
      themeColor: color
    })
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
  const { config, setConfig } = useLoginUser()
  const { trigger } = useUpdateUserConfigSwrApi()
  const current = config?.profileVisibility

  const options: Array<RadioOptionItemType> = Object.entries(VisibilityLevelEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
      description: value.description,
      value: key as VisibilityLevelEnum
    })
  )

  const handleChange = async (value: string) => {
    const c = await trigger({
      profileVisibility: value as VisibilityLevelEnum
    })
    setConfig(c.data)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl font-medium">Profile Visibility</div>
      <Radio value={current} options={options} onChange={handleChange} />
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
  const { config, setConfig } = useLoginUser()
  const { trigger } = useUpdateUserConfigSwrApi()
  const current = config?.whoCanComment

  const options: Array<RadioOptionItemType> = Object.entries(DynamicPermissionEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
      description: value.description,
      value: key as DynamicPermissionEnum
    })
  )

  const handleChange = async (value: string) => {
    const c = await trigger({
      whoCanComment: value as DynamicPermissionEnum
    })
    setConfig(c.data)
  }

  return (
    <div className=" flex flex-col gap-3">
      <div className="text-xl font-medium">Who Can Comment</div>
      <Radio value={current} options={options} onChange={handleChange} />
    </div>
  )
}

const MessagePermissionSetting = () => {
  const { config, setConfig } = useLoginUser()
  const { trigger } = useUpdateUserConfigSwrApi()
  const current = config?.whoCanMessage

  const options: Array<RadioOptionItemType> = Object.entries(DynamicPermissionEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
      description: value.description,
      value: key as VisibilityLevelEnum
    })
  )

  const handleChange = async (value: string) => {
    const c = await trigger({
      whoCanMessage: value as DynamicPermissionEnum
    })
    setConfig(c.data)
  }

  return (
    <div className=" flex flex-col gap-3">
      <div className="text-xl font-medium">Who Can Message</div>
      <Radio value={current} options={options} onChange={handleChange} />
    </div>
  )
}

export default MySettingPage
