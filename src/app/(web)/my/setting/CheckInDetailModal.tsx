import { useEffect, useState } from 'react'
import { Modal } from '~/shared/features'
import { useUserCheckInRecordSwrApi } from '~/apis/user-api'
import Calendar, { pad } from '~/shared/features/internal/Calendar'

type CheckInDetailModalProps = {
  open: boolean
  onClose: () => void
}

const CheckInDetailModal = (props: CheckInDetailModalProps) => {
  const { open, onClose } = props
  const { trigger } = useUserCheckInRecordSwrApi()
  // 获取年月 2025-12
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const [checkList, setCheckList] = useState<Set<string>>(new Set())

  const onGetCheckInList = async () => {
    const { data } = await trigger({
      month: `${year}-${month + 1}`
    })
    if (data) {
      // 将时间格式化为 YYYY-MM-DD
      const formattedDates = data.map((date) => {
        const localDate = new Date(date)
        return `${year}-${pad(month + 1)}-${pad(localDate.getDate())}`
      })
      setCheckList(new Set(formattedDates))
    }
  }

  useEffect(() => {
    if (open) {
      queueMicrotask(() => onGetCheckInList())
    }
  }, [open])

  return (
    <Modal title="签到记录" width={520} open={open} onClose={onClose} cancelText={null} okText='我知道了'>
      <div className="w-full">
        <Calendar
          year={year}
          month={month}
          values={checkList}
          remark={`本月已签到${checkList.size}天`}
          footer={
            <div className="flex items-center gap-3 mt-4 text-xs text-gray-600">
              <span className="w-4 h-4 rounded-full bg-primary" />
              已签到
            </div>
          }
        />
      </div>
    </Modal>
  )
}

export default CheckInDetailModal
