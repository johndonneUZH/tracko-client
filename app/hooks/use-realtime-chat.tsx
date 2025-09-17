'use client'

import { ApiService } from '@/api/apiService'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as StompJs from '@stomp/stompjs'
import SockJS from 'sockjs-client'

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

const TOPIC_PREFIX = '/topic/chat.'
const WS_ENDPOINT = '/ws' // MISMO endpoint del backend

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<StompJs.Client | null>(null)
  const apiService = new ApiService()

  // 1) Historial inicial por REST
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const initialMessages = await apiService.getMessages<ChatMessage[]>(roomName)
        if (alive) setMessages(initialMessages)
      } catch (error) {
        console.error('Failed to fetch initial messages:', error)
      }
    })()
    return () => { alive = false }
  }, [roomName])

  // 2) Conexión STOMP -> mismo /ws
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL || 'http://localhost:8081'
    const client = new StompJs.Client({
      webSocketFactory: () => new SockJS(`${baseUrl}${WS_ENDPOINT}`),
      reconnectDelay: 2000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Si tu interceptor lee Authorization del CONNECT, agrega aquí:
      // connectHeaders: { Authorization: `Bearer ${token}` },
      debug: () => {}
    })

    client.onConnect = () => {
      setIsConnected(true)
      client.subscribe(`${TOPIC_PREFIX}${roomName}`, (frame) => {
        try {
          const msg = JSON.parse(frame.body) as ChatMessage
          setMessages((curr) => [...curr, msg])
        } catch (e) {
          console.error('Bad message frame:', e)
        }
      })
    }

    client.onWebSocketClose = () => setIsConnected(false)

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [roomName])

  // 3) Enviar por REST (tu flujo actual ya persiste y emite)
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return
      const saved = await apiService.sendMessage<ChatMessage>(content, roomName)
      // push optimista; el broadcast regresará igual
      setMessages((curr) => [...curr, saved])
    },
    [roomName]
  )

  return { messages, sendMessage, isConnected }
}
