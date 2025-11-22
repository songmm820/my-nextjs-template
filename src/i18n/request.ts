import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
    // Static for now, we'll change this later

    const store = await cookies()
    const locale = store.get('locale')?.value || 'zh'

    const messages = await import(`../../messages/${locale}.json`).then((m) => m.default)

    return {
        locale,
        messages
    }
})
