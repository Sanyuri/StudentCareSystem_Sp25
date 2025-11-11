import React, { useEffect, useRef, useState } from 'react'
import { Button, Badge } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'

interface PhoneSideTabProps {
  onClick: () => void
}

const PhoneSideTab: React.FC<PhoneSideTabProps> = ({ onClick }) => {
  const tabRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: window.innerWidth - 70, y: window.innerHeight / 2 - 24 })

  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })
  const wasDragged = useRef(false)

  // Store window dimensions in a ref to avoid unnecessary re-renders
  const windowDimensions = useRef({ width: window.innerWidth, height: window.innerHeight })

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      windowDimensions.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      // Also adjust position if it's now outside the window
      setPos((prevPos) => {
        const maxX = window.innerWidth - 64 // 64px is the width of the button
        const maxY = window.innerHeight - 64
        return {
          x: Math.min(prevPos.x, maxX),
          y: Math.min(Math.max(0, prevPos.y), maxY),
        }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    wasDragged.current = false
    startPos.current = { x: e.clientX, y: e.clientY }
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return

    // Calculate distance moved to determine if this is a drag or a click
    const distMoved = Math.sqrt(
      Math.pow(e.clientX - startPos.current.x, 2) + Math.pow(e.clientY - startPos.current.y, 2),
    )

    // If moved more than 5px, consider it a drag
    if (distMoved > 5) {
      wasDragged.current = true
    }

    // Calculate new position with boundary constraints
    const newX = e.clientX - offset.current.x
    const newY = e.clientY - offset.current.y

    // Apply boundary constraints
    const maxX = windowDimensions.current.width - 64 // 64px is the width of the button
    const maxY = windowDimensions.current.height - 64

    setPos({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY),
    })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  const handleButtonClick = () => {
    // Only trigger onClick if it wasn't being dragged
    if (!wasDragged.current) {
      onClick()
    }
  }

  return (
    <div
      ref={tabRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className='w-16 h-16'
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 1000,
        cursor: isDragging.current ? 'grabbing' : 'grab',
      }}
    >
      <Badge color='red' offset={[-5, 5]}>
        <Button
          type='primary'
          shape='circle'
          icon={<PhoneOutlined style={{ fontSize: 24 }} />}
          onClick={handleButtonClick}
          className='!w-16 !h-16 flex items-center justify-center bg-blue-500 text-white shadow-xl hover:bg-blue-600 transition-all duration-300 hover:scale-110 border-2 border-white'
        />
      </Badge>
    </div>
  )
}

export default PhoneSideTab
