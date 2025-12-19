import clsx from 'clsx'
import { getDaysInMonth, getFirstDayWeek } from '~/shared/utils/client'

// 把 1~31 的「月/日」数字补足两位，前面补 0
export const pad = (n: number) => String(n).padStart(2, '0')

// 把「年、月、日」三个数字拼成 统一格式的字符串 'YYYY-MM-DD
const toKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

const weekDay = ['日', '一', '二', '三', '四', '五', '六']

export type CalendarProps = {
  year: number
  month: number // 0-11
  values?: Set<string> // 'YYYY-MM-DD'
  footer?: React.ReactNode
  remark?: React.ReactNode
}

const Calendar = ({ year, month, footer, remark, values = new Set() }: CalendarProps) => {
  const days = getDaysInMonth(year, month)
  // 前面空白天数
  const offset = getFirstDayWeek(year, month)



  return (
    <div className="w-full max-w-lg mx-auto">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold">
          {year} 年 {month + 1} 月
        </span>
        <div className="text-xs text-gray-500">{remark}</div>
      </div>

      {/* 星期 */}
      <div className="grid grid-cols-7 gap-2 mb-3 text-center text-base text-gray-500">
        {weekDay.map((v) => (
          <div key={v}>{v}</div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 place-items-center gap-2">
        {[
          // 1. 先铺空白
          ...Array.from({ length: offset }, (_, i) => <div key={`e-${i}`} />),
          // 2. 再铺真实日期
          ...Array.from({ length: days }, (_, i) => {
            const d = i + 1
            const key = toKey(year, month, d)
            return (
              <div
                key={key}
                className={clsx(
                  'h-10 aspect-square rounded-full',
                  'flex items-center justify-center cursor-pointer transition ',
                  values.has(key) && 'bg-primary text-white text-base'
                )}
              >
                {d}
              </div>
            )
          })
        ]}
      </div>
      {/* 底部 */}
      {footer}
    </div>
  )
}
export default Calendar
