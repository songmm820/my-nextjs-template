import React from 'react'

interface BackgroundContainerProps {
    children: React.ReactNode
    backgroundColor?: string
    backgroundImage?: string
}

const BackgroundContainer = (props: BackgroundContainerProps) => {
    const { children, backgroundColor, backgroundImage } = props

    const styles = React.useMemo(() => {
        const style: React.CSSProperties = {}
        if (backgroundImage) {
            style.backgroundImage = `url(${backgroundImage})`
            style.backgroundSize = 'cover'
            style.backgroundRepeat = 'no-repeat'
            style.backgroundPosition = 'center'
        } else {
            style.backgroundColor = backgroundColor
        }
        return style
    }, [backgroundColor, backgroundImage])

    return (
        <div className="w-full h-full" style={styles}>
            {children}
        </div>
    )
}

export default BackgroundContainer
