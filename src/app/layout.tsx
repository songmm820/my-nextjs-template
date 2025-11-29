import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '~/context/ThemeProvider'
import './globals.css'
import { NavigationBlockerProvider } from '~/context/NavigationBlockerProvider'
import { LoginUserProvider } from '~/context/LoginUserProvider'
import Script from 'next/script'

// 图标库链接
const envIconScriptLink =
  'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_41789_1.171eb98c595fefca3982168cd8740866.js'

export const metadata: Metadata = {
  title: "Nicks's Knack",
  description: 'A Personal Website for Nick'
}

const RootLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <head>
        <Script src={envIconScriptLink}></Script>
      </head>
      <body>
        <NavigationBlockerProvider>
          <NextIntlClientProvider>
            <ThemeProvider>
              <LoginUserProvider>
                {children} {/* Will render your page */}
              </LoginUserProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </NavigationBlockerProvider>
      </body>
    </html>
  )
}

export default RootLayout
