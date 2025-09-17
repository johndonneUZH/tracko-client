'use client'

import { ChatMessageItem } from '@/components/magicui/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { type ChatMessage, useRealtimeChat } from '@/hooks/use-realtime-chat'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface RealtimeChatProps {
  roomName: string
  username: string
  className?: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  className = '',
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()
  const [newMessage, setNewMessage] = useState('')

  const {
    messages: realtimeMessages,
    sendMessage,
  } = useRealtimeChat({
    roomName,
    username,
  })

  // Merge y dedupe por id (mantiene orden por fecha)
  const allMessages = useMemo(() => {
    const map = new Map<string, ChatMessage>()
    initialMessages.forEach((m) => map.set(m.id, m))
    realtimeMessages.forEach((m) => map.set(m.id, m))
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    onMessage?.(allMessages)
  }, [allMessages, onMessage])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const content = newMessage.trim()
      if (!content) return
      try {
        await sendMessage(content) // REST guarda y el server emite al topic
        setNewMessage('')
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    },
    [newMessage, sendMessage]
  )

  return (
    <div className={`flex flex-col h-full w-full bg-background text-foreground antialiased ${className}`}>
      {/* Mensajes */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-1">
            {allMessages.map((message, index) => (
              <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.username === username}
                  showHeader={!allMessages[index - 1] || allMessages[index - 1].username !== message.username}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input fijo abajo */}
      <form onSubmit={handleSendMessage} className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            className="flex-1 rounded-full bg-background text-sm transition-all duration-300"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                ;(e.currentTarget.form as HTMLFormElement | null)?.requestSubmit()
              }
            }}
            placeholder="Type a message..."
            aria-label="Type your message"
          />
          {newMessage.trim() && (
            <button type="submit" className="aspect-square rounded-full" aria-label="Send message">
              <Send className="size-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
