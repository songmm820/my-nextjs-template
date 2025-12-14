import clsx from 'clsx'
import { primaryColorList, type ThemeColorType } from '~/shared/constants'
import Icon from '~/shared/components/Icon'

type ThemeColorPickerProps = {
  color?: ThemeColorType
  onChange?: (color: ThemeColorType) => void
}

const ThemeColorPicker = (props: ThemeColorPickerProps) => {
  const { color: activeColor, onChange } = props
  // 判断是否选中，不区分大小写
  const isSelected = (color: ThemeColorType) => {
    return activeColor?.toLowerCase() === color.toLowerCase()
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {primaryColorList.map((color, index) => {
        return (
          <div
            key={index}
            style={{
              borderColor: color
            }}
            className={clsx(
              'w-8 h-8 rounded-full border cursor-pointer transition-all duration-500',
              !isSelected(color) && 'hover:scale-120 hover:border-none'
            )}
            onClick={() => onChange?.(color)}
          >
            <div
              className="w-full h-full rounded-full inline-flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {isSelected(color) && <Icon name="check-small" size={14} color="#fff" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ThemeColorPicker
