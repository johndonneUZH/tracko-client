'use client'

import { ApiService } from '@/api/apiService'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/types/user'
import { useCallback, useEffect, useState } from 'react'

interface UseRealtimeChatProps {
  roomName: string
  username: string
}

export interface ChatMessage {
  id: string
  content: string
  senderId: string
  username: string
  projectId: string
  createdAt: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const apiService = new ApiService()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const initialMessages = await apiService.getMessages<ChatMessage[]>(roomName)
        setMessages(initialMessages)
      } catch (error) {
        console.error('Failed to fetch initial messages:', error)
      }
    }
  
    fetchMessages()
  }, [roomName])
  
  useEffect(() => {
    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const message = payload.payload as ChatMessage
        setMessages((current) => [...current, message])
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return

      const message = await apiService.sendMessage<ChatMessage>(content, roomName)

      // Update local state immediately for the sender
      setMessages((current) => [...current, message])

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      })
    },
    [channel, isConnected, username]
  )

  return { messages, sendMessage, isConnected }
}