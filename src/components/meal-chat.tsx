"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatBotProps {
  onClose: () => void
}

export default function MealChat({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(
      () => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("hola") || input.includes("hi")) {
      return "¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte?"
    } else if (input.includes("mapa") || input.includes("ubicación")) {
      return "Puedo ayudarte a encontrar ubicaciones en el mapa. ¿Qué lugar estás buscando?"
    } else if (input.includes("ruta") || input.includes("dirección")) {
      return "Para obtener direcciones, por favor dime tu punto de partida y destino."
    } else if (input.includes("gracias") || input.includes("thanks")) {
      return "¡De nada! Estoy aquí para ayudarte. ¿Necesitas algo más?"
    } else if (input.includes("ayuda") || input.includes("help")) {
      return "Puedo ayudarte con: búsqueda de ubicaciones, rutas, información del campus, y más. ¿Qué necesitas?"
    } else {
      return "Entiendo. ¿Podrías darme más detalles para poder ayudarte mejor?"
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/20 animate-in fade-in duration-300">
      <div className="h-full w-full max-w-2xl animate-in slide-in-from-bottom duration-500">
        <div className="flex h-full flex-col bg-white">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 shadow-md"
            style={{ backgroundColor: "var(--brand-blue)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{"Asistente Virtual"}</h2>
                <p className="text-xs text-white/80">{"En línea"}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 transition-all hover:bg-white/20 active:scale-95">
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    message.sender === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      message.sender === "bot" ? "bg-[var(--brand-blue)]" : "bg-gray-200",
                    )}
                  >
                    {message.sender === "bot" ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                      message.sender === "bot"
                        ? "rounded-tl-none bg-gray-100 text-gray-800"
                        : "rounded-tr-none text-white",
                    )}
                    style={message.sender === "user" ? { backgroundColor: "var(--brand-blue)" } : undefined}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={cn("mt-1 text-xs", message.sender === "bot" ? "text-gray-500" : "text-white/70")}>
                      {message.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-3 animate-in fade-in duration-300">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--brand-blue)" }}
                  >
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-4 py-4">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-12 rounded-2xl border-2 border-gray-200 px-4 focus:border-[var(--brand-blue)]"
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim()}
                className="h-12 w-12 shrink-0 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--brand-blue)",
                  color: "white",
                }}
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">{"Enviar"}</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
