'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useZIndex } from '../context/ComponentProvider'

interface ModalProps {
    children: React.ReactNode
    open?: boolean
    onClose?: () => void
}

const Modal = ({ children, open = false, onClose }: ModalProps) => {
    const { nextZ } = useZIndex()
    const [modalState, setModalState] = useState<boolean>(false)
    const [z, setZ] = useState<number>()

    // useEffect(() => {
    //     if (open) {
    //         Promise.resolve().then(() => {
    //             const newZ = nextZ()
    //             setZ(() => newZ)
    //             setModalState(open)
    //         })
    //     }
    // }, [open, nextZ])

    return (
        <>
            {modalState && (
                <motion.div
                    style={{
                        zIndex: nextZ(),
                    }}
                >
                    {children}
                </motion.div>
            )}
        </>
    )
}

export default Modal
