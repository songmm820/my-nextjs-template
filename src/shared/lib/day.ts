import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言

dayjs.locale('zh-cn') // 使用本地化语言

// 导出已本地化实例
export { dayjs as customDayjs }
