import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '~/context/ThemeProvider'
import './globals.css'
import { NavigationBlockerProvider } from '~/context/NavigationBlockerProvider'
import { LoginUserProvider } from '~/context/LoginUserProvider'

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
