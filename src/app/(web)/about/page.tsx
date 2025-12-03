'use client'

import { useTheme } from '~/context/ThemeProvider'
import { Button } from '~/shared/features'

const AboutPage = () => {
  const { setThemeColor } = useTheme()

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-4">
      <div className="w-20 h-20 bg-primary"></div>
      <Button
        variant="primary"
        onClick={() => {
          setThemeColor('#0C2EB6')
        }}
      >
        Color
      </Button>
    </div>
  )
}

export default AboutPage
