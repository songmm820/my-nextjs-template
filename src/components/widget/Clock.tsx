'use client'

import { motion, AnimatePresence } from 'motion/react'
import useClock from '@/hooks/use-clock'
import { customDayjs } from '@/lib/day'
import clsx from 'clsx'

type DigitProps = { digit: string }

function Digit({ digit }: DigitProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={digit}
                className={clsx(
                    'w-24 h-24 rounded-2xl glass-bg',
                    'flex items-center justify-center',
                    'text-5xl font-bold text-gray-50'
                )}
            >
                {digit}
            </motion.div>
        </AnimatePresence>
    )
}

// 分割符
const Separator = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="w-4 h-4 glass-bg rounded-full"></div>
            <div className="w-4 h-4 glass-bg rounded-full"></div>
        </div>
    )
}

export default function FadeClockMotionTailwind() {
    const timeClock = useClock()

    const timeObj = timeClock
        ? {
              hour: customDayjs(timeClock).format('HH'),
              minute: customDayjs(timeClock).format('mm'),
              second: customDayjs(timeClock).format('ss'),
          }
        : null

    return (
        <>
            {timeObj && (
                <div className="flex items-center gap-3">
                    <Digit digit={timeObj.hour} />
                    <Separator />
                    <Digit digit={timeObj.minute} />
                    <Separator />
                    <Digit digit={timeObj.second} />
                </div>
            )}
        </>
    )
}
