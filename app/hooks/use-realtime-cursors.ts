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
const generateRandomNumber = () => Math.floor(Math.random() * 100)

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
  throttleMs,
}: {
  roomName: string
  username: string
  throttleMs: number
}) => {
  const [color, setColor] = useState<string>('')
  const [userId, setUserId] = useState<number>(0)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
  
  const [cursors, setCursors] = useState<Record<string, CursorEventPayload>>({})
  const channelRef = useRef<RealtimeChannel | null>(null)

  const callback = useCallback(
    (event: MouseEvent) => {
      const { clientX, clientY } = event

      const payload: CursorEventPayload = {
        position: { x: clientX, y: clientY },
        user: { id: userId, name: username },
        color,
        timestamp: Date.now(),
      }

      channelRef.current?.send({
        type: 'broadcast',
        event: EVENT_NAME,
        payload,
      })
    },
    [color, userId, username]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setCursors((prev) => {
        const updated: typeof prev = {}
        for (const [key, cursor] of Object.entries(prev)) {
          // 5000ms = 5 seconds
          if (now - cursor.timestamp < 5000) {
            updated[key] = cursor
          }
        }
        return updated
      })
    }, 1000) // check every 1 second
  
    return () => clearInterval(interval)
  }, [])
  

  const handleMouseMove = useThrottleCallback(callback, throttleMs)

  useEffect(() => {
    const channel = supabase.channel(roomName)
    channelRef.current = channel

    channel
      .on('broadcast', { event: EVENT_NAME }, (data: { payload: CursorEventPayload }) => {
        const { user } = data.payload
        if (user.id === userId) return

        setCursors((prev) => ({
          ...prev,
          [user.id]: data.payload,
        }))
      })
      .on('broadcast', { event: EVENT_LEAVE }, (data: { payload: { userId: number } }) => {
        const leftUserId = data.payload.userId
        setCursors((prev) => {
          const updated = { ...prev }
          delete updated[leftUserId]
          return updated
        })
      })
      .subscribe()

    return () => {
      channel.send({
        type: 'broadcast',
        event: EVENT_LEAVE,
        payload: {
          userId,
        },
      })

      channel.unsubscribe()
    }
  }, [roomName, userId])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return { cursors }
}
