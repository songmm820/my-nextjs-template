import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '~/context/theme-provider'
import './globals.css'

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
        <ThemeProvider>
          <NextIntlClientProvider>
            {children} {/* Will render your page */}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
