import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言

dayjs.locale('zh-cn') // 使用本地化语言

// 导出已本地化实例
export { dayjs as customDayjs }

/**
 * 获取某年某月的天数
 *
 * @param y 年
 * @param m 月 0-11
 */
export function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

/**
 * 返回「某年某月 1 号」是星期几
 * @param y 年
 * @param m 月
 */
export function getFirstDayWeek(y: number, m: number) {
  return new Date(y, m, 1).getDay()
}
