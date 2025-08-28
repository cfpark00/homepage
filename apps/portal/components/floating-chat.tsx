"use client"

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Card } from '@workspace/ui/components/card'

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'ai'}[]>([
    { text: "Hi! I'm your AI assistant. How can I help you with this project?", sender: 'ai' }
  ])

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }])
      // Mock AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm here to help! This feature is coming soon.", 
          sender: 'ai' 
        }])
      }, 1000)
      setMessage('')
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 z-50 flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">AI Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg text-sm",
                  msg.sender === 'user' 
                    ? "ml-auto bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          "hover:scale-110 transition-transform",
          "flex items-center justify-center"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  )
}