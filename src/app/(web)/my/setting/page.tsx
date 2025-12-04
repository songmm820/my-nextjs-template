'use client'

import PageContainer from '~/shared/components/PageContainer'
import Avatar from '~/shared/components/Avatar'
import { useLoginUser } from '~/context/LoginUserProvider'
import ThemeColorPicker from '~/shared/components/ThemeColorPicker'
import { useTheme } from '~/context/ThemeProvider'
import { type ThemeColorType } from '~/shared/constants'

const MySettingPage = () => {
  const { user } = useLoginUser()

  return (
    <PageContainer>
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full text-center text-3xl font-medium">My Setting</div>
        <div className="w-160 mt-4 flex flex-col">
          <div className="w-full flex justify-center">
            {user && <Avatar src={user?.avatar} size={150} />}
          </div>
          <ThemeColorSetting />
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
    <div className="mt-6 flex flex-col gap-3">
      <div className="text-xl font-medium">Theme Color {themeColor}</div>
      <ThemeColorPicker color={themeColor} onChange={handleThemeColorChange} />
    </div>
  )
}

export default MySettingPage
