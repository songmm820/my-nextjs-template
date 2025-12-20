'use client'

import clsx from 'clsx'
import PageContainer from '~/shared/components/PageContainer'
import Avatar from '~/shared/components/Avatar'
import { useLoginUser } from '~/context/LoginUserProvider'
import ThemeColorPicker from '~/shared/components/ThemeColorPicker'
import { useTheme } from '~/context/ThemeProvider'
import { type ThemeColorType } from '~/shared/constants'
import { Button, ModalManager, Radio, type RadioOptionItemType } from '~/shared/features'
import { DynamicPermissionEnum } from '~/generated/prisma/enums'
import {
  useUpdateUserConfigSwrApi,
  useUpdateUserProfileSwrApi,
  useUserDailyCheckInSwrApi
} from '~/apis/user-api'
import AvatarSettingModal from './AvatarSettingModal'
import { useState } from 'react'
import { useObjectStorageUploadSwrApi } from '~/apis/object-storage-api'
import { ObjectStorage } from '~/shared/enums/comm'
import { createObjectStorageForm } from '~/shared/utils/client/file'
import Icon from '~/shared/components/Icon'
import { useAuthGuard } from '~/context/AuthGuardProvider'
import CheckInDetailModal from './CheckInDetailModal'

const DynamicPermissionEnumObjInfo = {
  [DynamicPermissionEnum.ALL]: {
    label: '全部'
  },
  [DynamicPermissionEnum.FOLLOWERS]: {
    label: '仅关注'
  },
  [DynamicPermissionEnum.SELF]: {
    label: '仅自己'
  }
}

const MySettingPage = () => {
  return (
    <PageContainer>
      <div className={clsx('w-full flex flex-col items-center py-6 rounded-2xl bg-white relative')}>
        <div className="w-160 flex flex-col gap-3">
          <MyProfileSetting />
          <div className="mt-6 flex flex-col gap-6">
            <ThemeColorSetting />
            <ProfileVisibilitySetting />
            <CommentPermissionSetting />
            <MessagePermissionSetting />
          </div>
        </div>
        <div className="absolute right-6 top-4">
          <Logout />
        </div>
      </div>
    </PageContainer>
  )
}

const Logout = () => {
  const { onSignOut } = useAuthGuard()

  const handleLogout = () => {
    ModalManager.confirm({
      title: '退出登录',
      content: '你确定要退出登录吗？',
      okCallback: onSignOut
    })
  }

  return (
    <div className="inline-flex justify-center cursor-pointer" onClick={handleLogout}>
      <Icon name="power" color="#999" size={22} />
    </div>
  )
}

const LevelExp = () => {
  const { growthValue, isTodaySigned, setGrowthValue, setTodaySigned } = useLoginUser()
  const { trigger } = useUserDailyCheckInSwrApi()
  const [isShowModal, setIsShowModal] = useState<boolean>(false)

  const handleCheckIn = async () => {
    if (isTodaySigned) {
      ModalManager.warning('你今天已经签到过了，明天再来吧！')
      return
    }
    const { data, error } = await trigger()
    if (!error) {
      setTodaySigned(true)
      setGrowthValue(data)
    }
  }

  return (
    <div className="w-52 bg-primary/2 px-4 pt-2 pb-3 rounded-md">
      <div className="flex items-center justify-between">
        <div className="text-999 text-md">
          {growthValue?.exp} / {growthValue?.maxExp}
        </div>
        <div className="text-sm text-primary cursor-pointer" onClick={() => setIsShowModal(true)}>
          查看详情
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
        {isTodaySigned ? '已签到' : '签到'}
      </Button>

      <CheckInDetailModal open={isShowModal} onClose={() => setIsShowModal(false)} />
    </div>
  )
}

const MyProfileSetting = () => {
  const { user, growthValue, setUserInfo } = useLoginUser()
  const { trigger: updateProfileTrigger } = useUpdateUserProfileSwrApi()
  const { trigger: uploadFileTrigger } = useObjectStorageUploadSwrApi()
  const [isShowModalSetting, setIsShowModalSetting] = useState<boolean>(false)

  const handleAvatarChange = async () => {
    setIsShowModalSetting(true)
  }

  const handleAvatarOk = async (avatar: Blob) => {
    // blob 转成 file
    const file = new File([avatar], 'avatar.png', { type: avatar.type })
    const formData = createObjectStorageForm({
      object: file,
      type: ObjectStorage.AVATAR
    })
    const { data } = await uploadFileTrigger(formData)
    const url = data.url
    if (url) {
      const { data, error } = await updateProfileTrigger({
        avatar: url
      })
      if (!error) {
        ModalManager.success('修改成功！')
        setUserInfo(data)
        setIsShowModalSetting(false)
      }
    }
  }

  const handleChangeName = async (name: string) => {
    ModalManager.input({
      title: '修改昵称',
      value: name,
      okCallback: async (value: string) => {
        const { data, error } = await updateProfileTrigger({
          name: value
        })
        if (!error) {
          ModalManager.success('修改成功！')
          setUserInfo(data)
        }
      }
    })
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="text-xl font-medium">个人信息</div>
        <div className="w-full flex items-center gap-6 h-40">
          <div className="w-[150px] h-[150px] cursor-pointer" onClick={handleAvatarChange}>
            {user && <Avatar isSquare src={user?.avatar} size={150} />}
          </div>
          {user && (
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <div className="mb-2 px-4">
                <div className="text-666 text-xl flex items-center">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{user?.name}</span>
                    <div className="cursor-pointer" onClick={() => handleChangeName(user.name)}>
                      <Icon name="edit" color="#666" />
                    </div>
                  </div>
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

      <AvatarSettingModal
        url={user?.avatar ?? ''}
        open={isShowModalSetting}
        onClose={() => setIsShowModalSetting(false)}
        onCropComplete={handleAvatarOk}
      />
    </>
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
      <div className="text-xl font-medium">主题颜色</div>
      <ThemeColorPicker color={themeColor} onChange={handleThemeColorChange} />
    </div>
  )
}

const ProfileVisibilitySetting = () => {
  const { config, setConfig } = useLoginUser()
  const { trigger } = useUpdateUserConfigSwrApi()
  const current = config?.profileVisibility

  const options: Array<RadioOptionItemType> = Object.entries(DynamicPermissionEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
      value: key as DynamicPermissionEnum
    })
  )

  const handleChange = async (value: string) => {
    const c = await trigger({
      profileVisibility: value as DynamicPermissionEnum
    })
    setConfig(c.data)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl font-medium">个人权限</div>
      <Radio
        value={current}
        options={options}
        onChange={(value) => handleChange(value as string)}
      />
    </div>
  )
}

const CommentPermissionSetting = () => {
  const { config, setConfig } = useLoginUser()
  const { trigger } = useUpdateUserConfigSwrApi()
  const current = config?.whoCanComment

  const options: Array<RadioOptionItemType> = Object.entries(DynamicPermissionEnumObjInfo).map(
    ([key, value]) => ({
      label: value.label,
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
      <div className="text-xl font-medium">评论权限</div>
      <Radio
        value={current}
        options={options}
        onChange={(value) => handleChange(value as string)}
      />
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
      value: key as DynamicPermissionEnum
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
      <div className="text-xl font-medium">私信权限</div>
      <Radio
        value={current}
        options={options}
        onChange={(value) => handleChange(value as string)}
      />
    </div>
  )
}

export default MySettingPage
