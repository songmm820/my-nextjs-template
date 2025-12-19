'use client'

import { useEffect, useState } from 'react'
import { useUserCheckInRecordSwrApi } from '~/apis/user-api'
import Empty from '~/shared/components/Empty'
import { Button, Calendar, Modal, ModalManager } from '~/shared/features'
import { pad } from '~/shared/features/internal/Calendar'
const mockSigned = new Set([
  '2025-06-01',
  '2025-06-02',
  '2025-06-03',
  '2025-06-05',
  '2025-06-06',
  '2025-06-07',
  '2025-06-08',
  '2025-06-09',
  '2025-06-10',
  '2025-06-15',
  '2025-06-16',
  '2025-06-17',
  '2025-06-18',
  '2025-06-19',
  '2025-06-20',
  '2025-06-21',
  '2025-06-22',
  '2025-06-23',
  '2025-06-24',
  '2025-06-25',
  '2025-06-26',
  '2025-06-27',
  '2025-06-28',
  '2025-06-29',
  '2025-06-30'
])

const AboutPage = () => {
  const [openModal, setOpenModal] = useState(false)

  const { trigger } = useUserCheckInRecordSwrApi()
  // 获取年月 2025-12
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const [checkList, setCheckList] = useState<Set<string>>(new Set())

  useEffect(() => {
    trigger({
      month: `${year}-${month + 1}`
    }).then(({ data }) => {
      if (data) {
        // 将时间格式化为 YYYY-MM-DD
        const formattedDates = data.map((date) => {
          const localDate = new Date(date)
          return `${year}-${pad(month + 1)}-${pad(localDate.getDate())}`
        })
        setCheckList(new Set(formattedDates))
      }
    })
  }, [])

  return (
    <div className="h-auto w-120 mx-auto flex flex-col justify-center gap-4">
      {JSON.stringify(checkList)}
      <Calendar
        year={year}
        month={month} // 0 基
        values={checkList}
        remark={`本月已签到${checkList.size}天`}
        footer={
          <div className="flex items-center gap-3 mt-4 text-xs text-gray-600">
            <span className="w-4 h-4 rounded bg-gray-100 border" />
            未签
            <span className="w-4 h-4 rounded bg-green-300" />
            1-6
            <span className="w-4 h-4 rounded bg-green-400" />
            7-13
            <span className="w-4 h-4 rounded bg-green-500" />
            14-20
            <span className="w-4 h-4 rounded bg-green-600" />
            21+
          </div>
        }
      />
      <Empty />
      <Button
        onClick={() =>
          ModalManager.confirm({
            content: 'Open Modal',
            okCallback: () => {}
          })
        }
      >
        Open Modal
      </Button>
      <Button onClick={() => ModalManager.success('success')}>Toast</Button>
      <Button onClick={() => ModalManager.error('error')}>Toast</Button>
      <Button
        onClick={() =>
          ModalManager.input({
            value: 'value 123...'
          })
        }
      >
        Input
      </Button>
      <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
      <Modal title="Setting" open={openModal} onClose={() => setOpenModal(false)}>
        <div className="h-20">Open</div>
      </Modal>
    </div>
  )
}

export default AboutPage
