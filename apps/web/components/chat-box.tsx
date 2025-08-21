"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Send, Bot, User, RefreshCw, Mail } from "lucide-react"
import { toast } from "sonner"

type Message = {
  id: number
  text: string
  sender: "user" | "core"
  timestamp: Date
}

const virtualInitialMessage: Message = {
  id: 1,
  text: "Hi! I'm Core's AI assistant. I can answer questions about my research, publications, and academic interests. How can I help you today?",
  sender: "core",
  timestamp: new Date(),
}

const realInitialMessage: Message = {
  id: 1,
  text: "Hi! I'm always open to discussing new research directions and collaborations, especially at the intersection of AI, physics, and neuroscience. If you have an interesting project or idea, don't hesitate to reach out via email!",
  sender: "core",
  timestamp: new Date(),
}

const sampleResponses = [
  "That's a great question about in-context learning! My recent work shows that transformers develop representations through competition dynamics between tokens. Would you like to know more about the algorithmic phases we discovered?",
  "I'm particularly interested in the intersection of AI, astrophysics, and neuroscience. Each field offers unique perspectives on complex systems and information processing.",
  "My work on C. elegans whole-brain imaging has revealed fascinating patterns in neural dynamics during natural behavior. We can now track every neuron in real-time!",
  "The diffusion models we developed for dark matter reconstruction achieve 10x better performance than traditional methods. It's exciting to see ML revolutionizing cosmology!",
  "I'd be happy to discuss potential collaborations! My research spans from fundamental AI understanding to practical applications in science. Feel free to email me at corefranciscopark@g.harvard.edu",
  "Yes, I'm currently at NTT Research working on understanding AI through synthetic experiments. It's fascinating to probe the fundamental capabilities of neural networks.",
  "Great question! Compositional generalization is one of the key challenges in AI. Our recent NeurIPS paper shows how concept learning dynamics emerge in neural networks.",
  "I love working at the intersection of theory and application. Whether it's tracking neurons in C. elegans or reconstructing dark matter fields, ML provides powerful tools for scientific discovery.",
]

const quickQuestions = [
  "What's your current research focus?",
  "Tell me about in-context learning",
  "How do you combine AI and neuroscience?",
  "What are you working on at NTT?",
]

export function ChatBox() {
  const [isVirtual, setIsVirtual] = useState(true)
  const [messages, setMessages] = useState<Message[]>([virtualInitialMessage])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    // Reset messages when switching modes
    setMessages([isVirtual ? virtualInitialMessage : realInitialMessage])
  }, [isVirtual])

  const handleSend = () => {
    if (input.trim() === "") return

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInput("")

    if (isVirtual) {
      // Virtual Core responds
      setIsTyping(true)
      setTimeout(() => {
        const response: Message = {
          id: messages.length + 2,
          text: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
          sender: "core",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, response])
        setIsTyping(false)
      }, 1500)
    } else {
      // Real Core shows email prompt
      setTimeout(() => {
        const response: Message = {
          id: messages.length + 2,
          text: "Thanks for your message! I'll get back to you as soon as possible. Please reach out via email for a real conversation: corefranciscopark@g.harvard.edu",
          sender: "core",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, response])
      }, 1000)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
      inputElement?.focus()
    }, 0)
  }

  const handleReset = () => {
    setMessages([isVirtual ? virtualInitialMessage : realInitialMessage])
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden bg-background/60">
      <CardHeader className="space-y-1 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Chat with Core</CardTitle>
          <div className="flex items-center gap-3">
            {/* Toggle Slider */}
            <div className="flex items-center gap-2 rounded-full bg-muted p-1">
              <button
                onClick={() => setIsVirtual(true)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  isVirtual 
                    ? 'bg-background/95 text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                Virtual
              </button>
              <button
                onClick={() => setIsVirtual(false)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  !isVirtual 
                    ? 'bg-background/95 text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                Real
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="h-7 w-7"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs">
          {isVirtual 
            ? "Chat with Core's AI assistant about research and collaborations"
            : "Send a message to the real Core - response via email"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col gap-3 pb-3">
        <ScrollArea className="flex-1 rounded-md border bg-muted/20 p-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.sender === "user" ? "flex justify-end" : ""
                }`}
              >
                {message.sender === "user" ? (
                  <div className="max-w-[80%] space-y-1">
                    <div className="rounded-lg bg-primary/95 px-3 py-2 text-sm text-primary-foreground">
                      {message.text}
                    </div>
                    <p className="text-right text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {message.text}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></span>
              </div>
            )}
          </div>
        </ScrollArea>

        {!isVirtual && (
          <div className="rounded-md border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-2">
              For real collaboration inquiries, please email:
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                navigator.clipboard.writeText("corefranciscopark@g.harvard.edu")
                toast.success("Email copied to clipboard!")
              }}
            >
              <Mail className="mr-2 h-3 w-3" />
              corefranciscopark@g.harvard.edu
            </Button>
          </div>
        )}

        {isVirtual && (
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={isVirtual 
              ? "Ask about my research, papers, or collaborations..." 
              : "Type your collaboration inquiry..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend()
              }
            }}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}