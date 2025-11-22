'use client'

import { PRIMARY_COLORS } from '~/lib/color'
import { useTheme } from '~/provider/theme-provider'

const Client = () => {
    const { themeColor, setThemeColor } = useTheme()
    return (
        <div className='flex flex-wrap gap-2'>
            {themeColor}
            {PRIMARY_COLORS.map((color, index) => (
                <div
                    key={index}
                    className="w-9 h-9 rounded-full"
                    style={{
                        backgroundColor: color
                    }}
                    onClick={() => setThemeColor(color)}
                />
            ))}
        </div>
    )
}

export default Client
