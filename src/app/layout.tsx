import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import './globals.css'
import { NavigationBlockerProvider } from '~/context/NavigationBlockerProvider'
import { LoginUserProvider } from '~/context/LoginUserProvider'
import Script from 'next/script'
import { AuthGuardProvider } from '~/context/AuthGuardProvider'
import { ThemeProvider } from '~/context/ThemeProvider'
import { COOKIE_THEME_COLOR, type ThemeColorType } from '~/shared/constants'
import { getCookieSafe } from '~/shared/utils/server'
import { Toaster } from 'react-hot-toast'

// 图标库链接
const envIconScriptLink =
  'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_41789_10.62bdb151711d7f177aded1ee29dda0fe.js'

export const metadata: Metadata = {
  title: "Nicks's Knack",
  description: 'A Personal Website for Nick'
}

const RootLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const themeColor = ((await getCookieSafe(COOKIE_THEME_COLOR)) as ThemeColorType) || '#07A065'

  return (
    <html lang="en">
      <head>
        <Script src={envIconScriptLink} strategy="lazyOnload" />
        {/* 内联主题样式，避免闪烁 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --primary: ${themeColor};
            }
          `
          }}
        />
      </head>
      <body>
        <NavigationBlockerProvider>
          <NextIntlClientProvider>
            <LoginUserProvider>
              <AuthGuardProvider>
                <ThemeProvider themeColor={themeColor}>{children}</ThemeProvider>
              </AuthGuardProvider>
            </LoginUserProvider>
          </NextIntlClientProvider>
        </NavigationBlockerProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '50px'
              // background: '#333',
              // color: '#fff'
            }
          }}
        />
      </body>
    </html>
  )
}

export default RootLayout
