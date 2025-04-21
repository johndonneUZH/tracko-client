import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'

const useThrottleCallback = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
  delay: number
) => {
  const lastCall = useRef(0)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Params) => {
      const now = Date.now()
      const remainingTime = delay - (now - lastCall.current)

      if (remainingTime <= 0) {
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
        lastCall.current = now
        callback(...args)
      } else if (!timeout.current) {
        timeout.current = setTimeout(() => {
          lastCall.current = Date.now()
          timeout.current = null
          callback(...args)
        }, remainingTime)
      }
    },
    [callback, delay]
  )
}

const supabase = createClient()

const generateRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`
const generateRandomNumber = () => Math.floor(Math.random() * 10000) // Increased range for less collision

const EVENT_NAME = 'realtime-cursor-move'
const EVENT_LEAVE = 'realtime-cursor-leave'

type CursorEventPayload = {
  position: {
    x: number
    y: number
  }
  user: {
    id: number
    name: string
  }
  color: string
  timestamp: number
}

export const useRealtimeCursors = ({
  roomName,
  username,
  throttleMs = 50,
}: {
  roomName: string
  username: string
  throttleMs?: number
}) => {
  const [color, setColor] = useState<string>('')
  const [userId, setUserId] = useState<number>(0)
  const [cursors, setCursors] = useState<Record<string, CursorEventPayload>>({})
  const channelRef = useRef<RealtimeChannel | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  // Initialize user color and ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      containerRef.current = document.getElementById('cursor-container')
      
      const existingColor = localStorage.getItem('cursor-color')
      const existingId = localStorage.getItem('cursor-user-id')

      const finalColor = existingColor || generateRandomColor()
      const finalId = existingId ? parseInt(existingId) : generateRandomNumber()

      if (!existingColor) localStorage.setItem('cursor-color', finalColor)
      if (!existingId) localStorage.setItem('cursor-user-id', finalId.toString())

      setColor(finalColor)
      setUserId(finalId)
    }
  }, [])

  // Handle mouse movement
  const handleMouseMove = useThrottleCallback((event: MouseEvent) => {
    if (!channelRef.current) return

    const payload: CursorEventPayload = {
      position: { x: event.clientX, y: event.clientY },
      user: { id: userId, name: username },
      color,
      timestamp: Date.now(),
    }

    channelRef.current.send({
      type: 'broadcast',
      event: EVENT_NAME,
      payload,
    })
  }, throttleMs)

  // Clean up old cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setCursors(prev => {
        return Object.fromEntries(
          Object.entries(prev).filter(([_, cursor]) => now - cursor.timestamp < 5000)
        )
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Set up Supabase channel
  useEffect(() => {
    if (!roomName || !username || !userId) return

    const channel = supabase.channel(`realtime-cursors:${roomName}`, {
      config: {
        presence: { key: userId.toString() },
        broadcast: { ack: true }
      }
    })

    channelRef.current = channel

    channel
      .on('broadcast', { event: EVENT_NAME }, ({ payload }: { payload: CursorEventPayload }) => {
        if (payload.user.id === userId) return
        setCursors(prev => ({
          ...prev,
          [payload.user.id]: {
            ...payload,
            position: {
              x: payload.position.x - (containerRef.current?.getBoundingClientRect().left || 0),
              y: payload.position.y - (containerRef.current?.getBoundingClientRect().top || 0)
            }
          }
        }))
      })
      .on('broadcast', { event: EVENT_LEAVE }, ({ payload }: { payload: { userId: number } }) => {
        setCursors(prev => {
          const { [payload.userId]: _, ...rest } = prev
          return rest
        })
      })
      .subscribe()

    return () => {
      channel.send({
        type: 'broadcast',
        event: EVENT_LEAVE,
        payload: { userId }
      }).then(() => channel.unsubscribe())
    }
  }, [roomName, username, userId])

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return { 
    cursors,
    currentUser: { id: userId, color }
  }
}