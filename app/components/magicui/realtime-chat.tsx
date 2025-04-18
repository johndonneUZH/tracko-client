'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/magicui/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()
  const [newMessage, setNewMessage] = useState('')

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })

  // Merge and deduplicate messages
  const allMessages = useMemo(() => {
    const messageMap = new Map<string, ChatMessage>()
    
    // Add initial messages first
    initialMessages.forEach(msg => messageMap.set(msg.id, msg))
    
    // Add/update with realtime messages
    realtimeMessages.forEach(msg => messageMap.set(msg.id, msg))
    
    // Convert back to array and sort
    return Array.from(messageMap.values()).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
      if (!newMessage.trim() || !isConnected) return
      
      try {
        await sendMessage(newMessage)
        setNewMessage('')
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    },
    [newMessage, isConnected, sendMessage]
  )

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-1">
            {allMessages.map((message, index) => {
              const prevMessage = allMessages[index - 1]
              const showHeader = !prevMessage || prevMessage.username !== message.username

              return (
                <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.username === username}
                    showHeader={showHeader}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-border p-4">
        <Input
          className="flex-1 rounded-full bg-background text-sm transition-all duration-300"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        {isConnected && newMessage.trim() && (
          <Button
            type="submit"
            className="aspect-square rounded-full"
            disabled={!isConnected}
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  )
}