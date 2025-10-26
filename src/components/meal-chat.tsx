"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, X, Utensils, DollarSign, Calendar, MapPin, ChevronRight, Coffee, UtensilsCrossed, Moon, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Message {
    id: string
    text: string
    sender: "user" | "bot"
    timestamp: Date
}

interface Product {
    product_id: number
    name: string
    price: number
    quantity: number
}

interface Meal {
    meal_type: string
    place_id: number
    place_name: string
    latitude: number
    longitude: number
    products: Product[]
    total_cost: number
    discount_applied: string
}

interface DailyPlan {
    day: number
    meals: Meal[]
    daily_total: number
}

interface MealPlanResponse {
    total_budget: number
    days: number
    health_level: number
    daily_plans: DailyPlan[]
    total_cost: number
    remaining_budget: number
}

interface ApiResponse {
    success: boolean
    data: MealPlanResponse
    meta?: {
        iterations: number
        generated_at: string
    }
}

interface ChatBotProps {
    onClose: () => void
}

export default function MealChat({ onClose }: ChatBotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "¡Hola! Soy tu asistente de planes de comida. Cuéntame tu presupuesto, días y preferencias.",
            sender: "bot",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null)
    const [apiMeta, setApiMeta] = useState<ApiResponse["meta"] | null>(null)
    const [showResults, setShowResults] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const getMealIcon = (mealType: string) => {
        switch (mealType.toLowerCase()) {
            case "breakfast":
                return <Coffee className="h-5 w-5" />
            case "lunch":
                return <UtensilsCrossed className="h-5 w-5" />
            case "dinner":
                return <Moon className="h-5 w-5" />
            default:
                return <Utensils className="h-5 w-5" />
        }
    }

    const getMealLabel = (mealType: string) => {
        switch (mealType.toLowerCase()) {
            case "breakfast":
                return "Desayuno"
            case "lunch":
                return "Comida"
            case "dinner":
                return "Cena"
            default:
                return mealType
        }
    }

    const downloadPDF = async () => {
        if (!mealPlan) return

        try {
            // Dynamic import to avoid SSR issues
            const jsPDF = (await import("jspdf")).default

            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.getWidth()
            let yPosition = 20

            // Title
            doc.setFontSize(20)
            doc.setTextColor(0, 72, 120) // brand-blue
            doc.text("Plan de Comidas", pageWidth / 2, yPosition, { align: "center" })
            yPosition += 15

            // Summary
            doc.setFontSize(12)
            doc.setTextColor(0, 0, 0)
            doc.text(`Presupuesto Total: $${mealPlan.total_budget}`, 20, yPosition)
            yPosition += 7
            doc.text(`Dias: ${mealPlan.days}`, 20, yPosition)
            yPosition += 7
            doc.text(`Costo Total: $${mealPlan.total_cost}`, 20, yPosition)
            yPosition += 7
            doc.text(`Ahorro: $${mealPlan.remaining_budget}`, 20, yPosition)
            yPosition += 15

            // Daily Plans
            mealPlan.daily_plans?.forEach((dailyPlan) => {
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage()
                    yPosition = 20
                }

                // Day header
                doc.setFontSize(14)
                doc.setTextColor(0, 72, 120)
                doc.text(`Dia ${dailyPlan.day} - Total: $${dailyPlan.daily_total}`, 20, yPosition)
                yPosition += 10

                // Meals
                dailyPlan.meals.forEach((meal) => {
                    if (yPosition > 260) {
                        doc.addPage()
                        yPosition = 20
                    }

                    doc.setFontSize(11)
                    doc.setTextColor(0, 0, 0)
                    doc.text(`${getMealLabel(meal.meal_type)} - ${meal.place_name}`, 25, yPosition)
                    yPosition += 6

                    // Products
                    doc.setFontSize(9)
                    meal.products.forEach((product) => {
                        if (yPosition > 270) {
                            doc.addPage()
                            yPosition = 20
                        }
                        doc.text(`  ${product.quantity}x ${product.name} - $${product.price * product.quantity}`, 30, yPosition)
                        yPosition += 5
                    })

                    doc.setFontSize(10)
                    doc.text(`Total: $${meal.total_cost}`, 30, yPosition)
                    yPosition += 8
                })

                yPosition += 5
            })

            // Save PDF
            doc.save(`plan-comidas-${new Date().toLocaleDateString()}.pdf`)
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("Hubo un error al generar el PDF")
        }
    }

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
        const userPrompt = inputValue
        setInputValue("")
        setIsTyping(true)

        // Add warning message about processing time
        const warningMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "⏳ Generando tu plan de comidas... Esto puede tardar un momento, por favor espera.",
            sender: "bot",
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, warningMessage])

        try {
            // Call the API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generateMealPlan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status}`)
            }

            const apiResponse: ApiResponse = await response.json()

            // Debug: Log the response structure
            console.log("API Response:", apiResponse)

            // Check if response has the expected structure
            if (!apiResponse.success || !apiResponse.data) {
                throw new Error("La respuesta de la API no tiene el formato esperado")
            }

            // Store meal plan data (extract from data property)
            setMealPlan(apiResponse.data)
            setApiMeta(apiResponse.meta || null)
            
            // Wait a bit then show results with animation
            setTimeout(() => {
                setShowResults(true)
            }, 800)
        } catch (error) {
            // Handle error
            const errorMessage: Message = {
                id: (Date.now() + 2).toString(),
                text: `❌ Lo siento, hubo un error al procesar tu solicitud: ${error instanceof Error ? error.message : "Error desconocido"}`,
                sender: "bot",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
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
                                {showResults ? <Utensils className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">{showResults ? "Tu Plan de Comidas" : "Meal Assistant"}</h2>
                                <p className="text-xs text-white/80">{showResults ? "Plan personalizado" : "Online"}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="rounded-full p-2 transition-all hover:bg-white/20 active:scale-95">
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    {/* Content Area */}
                    {!showResults ? (
                        <>
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
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                    {message.text}
                                                </p>
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
                                            placeholder="Ej: Presupuesto 500, 2 días, comida saludable..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="h-12 rounded-2xl border-2 border-gray-200 px-4 focus:border-[var(--brand-blue)]"
                                            disabled={isTyping}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!inputValue.trim() || isTyping}
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
                        </>
                    ) : (
                        /* Results View */
                        <div className="flex-1 overflow-y-auto animate-in fade-in slide-in-from-right duration-700">
                            {mealPlan && (
                                <div className="p-6 space-y-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="h-5 w-5 text-[var(--brand-blue)]" />
                                                <span className="text-xs font-semibold text-gray-600">Días</span>
                                            </div>
                                            <p className="text-2xl font-bold text-[var(--brand-blue)]">{mealPlan.days || 0}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="h-5 w-5 text-green-700" />
                                                <span className="text-xs font-semibold text-gray-600">Presupuesto</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-700">${mealPlan.total_budget || 0}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="h-5 w-5 text-orange-700" />
                                                <span className="text-xs font-semibold text-gray-600">Restante</span>
                                            </div>
                                            <p className="text-2xl font-bold text-orange-700">${mealPlan.remaining_budget || 0}</p>
                                        </div>
                                    </div>

                                    {/* Daily Plans */}
                                    {mealPlan.daily_plans && mealPlan.daily_plans.length > 0 ? (
                                        mealPlan.daily_plans.map((dailyPlan, dayIndex) => (
                                        <div key={dailyPlan.day} className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${dayIndex * 100}ms` }}>
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                    <Calendar className="h-5 w-5 text-[var(--brand-blue)]" />
                                                    Día {dailyPlan.day}
                                                </h3>
                                                <span className="text-sm font-semibold text-gray-600">
                                                    Total: <span className="text-[var(--brand-blue)]">${dailyPlan.daily_total}</span>
                                                </span>
                                            </div>

                                            {/* Meals */}
                                            <div className="space-y-3">
                                                {dailyPlan.meals.map((meal, mealIndex) => (
                                                    <Link 
                                                        href="#" 
                                                        key={`${dailyPlan.day}-${meal.meal_type}`}
                                                        className="block group animate-in fade-in slide-in-from-left duration-500"
                                                        style={{ animationDelay: `${(dayIndex * 100) + (mealIndex * 50)}ms` }}
                                                    >
                                                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[var(--brand-blue)] transition-all duration-300 group-hover:scale-[1.02]">
                                                            {/* Meal Header */}
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[var(--brand-blue)] group-hover:bg-[var(--brand-blue)] group-hover:text-white transition-colors">
                                                                        {getMealIcon(meal.meal_type)}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-800">{getMealLabel(meal.meal_type)}</h4>
                                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                            <MapPin className="h-3 w-3" />
                                                                            <span>{meal.place_name}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg font-bold text-[var(--brand-blue)]">${meal.total_cost}</span>
                                                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[var(--brand-blue)] transition-colors" />
                                                                </div>
                                                            </div>

                                                            {/* Products */}
                                                            <div className="space-y-2 pl-13">
                                                                {meal.products.map((product) => (
                                                                    <div key={product.product_id} className="flex justify-between items-center text-sm">
                                                                        <span className="text-gray-600">
                                                                            {product.quantity}x {product.name}
                                                                        </span>
                                                                        <span className="text-gray-700 font-medium">${product.price * product.quantity}</span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {meal.discount_applied && (
                                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                                    <span className="text-xs text-green-600 font-medium">
                                                                        🎉 {meal.discount_applied}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No se encontraron planes de comidas en la respuesta.</p>
                                        </div>
                                    )}

                                    {/* Total Summary */}
                                    {mealPlan.total_cost !== undefined && (
                                    <div className="sticky bottom-0 bg-white border-t-4 border-[var(--brand-blue)] rounded-t-2xl shadow-2xl p-6 -mx-6 -mb-6 animate-in slide-in-from-bottom duration-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Total del Plan</p>
                                                <p className="text-3xl font-bold text-[var(--brand-blue)]">${mealPlan.total_cost}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 mb-1">Ahorraste</p>
                                                <p className="text-2xl font-bold text-green-600">${mealPlan.remaining_budget}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Download PDF Button */}
                                        <Button
                                            onClick={downloadPDF}
                                            className="w-full h-12 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                            style={{
                                                backgroundColor: "var(--brand-blue)",
                                                color: "white",
                                            }}
                                        >
                                            <Download className="h-5 w-5" />
                                            <span>Descargar Plan como PDF</span>
                                        </Button>
                                    </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
