"use client"

// --- IMPORTS COMBINADOS ---
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion" // No necesitamos 'Variants' aquí
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, MapPin, User, Settings, Plus, X, Percent, BanknoteArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonSequence } from "./button-sequence" // Importamos el hijo

// --- COMPONENTE MAP-OVERLAY (PRINCIPAL) ---
export default function MapOverlay({
    children
}: {
    children: React.ReactNode
}) {
    // --- Estados de Archivo 1 ---
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"map" | "profile" | "settings">("map")
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [isHiddenBadge, setIsHiddenBadge] = useState(true);

    // --- Estados de DRAG (de Archivo 3) ---
    const [showBottomSheet, setShowBottomSheet] = useState(false)
    const [selectedOption, setSelectedOption] = useState<"promotion" | "offer" | null>(null)
    const [sheetHeight, setSheetHeight] = useState(50) // percentage
    const [isDragging, setIsDragging] = useState(false)
    const dragStartY = useRef(0)
    const dragStartHeight = useRef(0)

    // --- Handlers de DRAG (de Archivo 3) ---
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true)
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
        dragStartY.current = clientY
        dragStartHeight.current = sheetHeight
    }

    const handleDragMove = (e: TouchEvent | MouseEvent) => {
        if (!isDragging) return
        e.preventDefault(); // Evita scroll de la página
        const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
        const deltaY = dragStartY.current - clientY
        const windowHeight = window.innerHeight
        const deltaPercent = (deltaY / windowHeight) * 100
        const newHeight = Math.min(Math.max(dragStartHeight.current + deltaPercent, 20), 90) // Límite 20% - 90%
        setSheetHeight(newHeight)
    }

    const handleDragEnd = () => {
        setIsDragging(false)
        // Snap a posiciones (puedes ajustar esto)
        if (sheetHeight < 35) {
            setShowBottomSheet(false)
            setSheetHeight(50)
        } else if (sheetHeight < 65) {
            setSheetHeight(50)
        } else {
            setSheetHeight(90)
        }
    }

    // --- useEffect de DRAG (de Archivo 3) ---
    useEffect(() => {
        if (isDragging) {
            const handleMove = (e: TouchEvent | MouseEvent) => handleDragMove(e)
            const handleEnd = () => handleDragEnd()

            window.addEventListener("touchmove", handleMove, { passive: false })
            window.addEventListener("mousemove", handleMove)
            window.addEventListener("touchend", handleEnd)
            window.addEventListener("mouseup", handleEnd)

            return () => {
                window.removeEventListener("touchmove", handleMove)
                window.removeEventListener("mousemove", handleMove)
                window.removeEventListener("touchend", handleEnd)
                window.removeEventListener("mouseup", handleEnd)
            }
        }
    }, [isDragging, sheetHeight])


    // --- Handlers para ABRIR el Sheet ---
    const handleOpenSheet = (option: "promotion" | "offer") => {
        setSelectedOption(option)
        setShowBottomSheet(true)
        setSheetHeight(50) // Empezar al 50%
        setIsHiddenBadge(true); // Ocultar los botones de nuevo
    }

    // --- Función para CERRAR el Sheet ---
    const closeSheet = () => {
        setShowBottomSheet(false)
        setSheetHeight(50) // Resetear altura
    }

    return (
        // 👇 IMPORTANTE: 'overflow-hidden' VUELVE a estar aquí
        <div className="relative h-screen w-full overflow-hidden bg-gray-100">
            {/* El Mapa (child) se renderiza aquí */}
            {
                children
            }

            {/* Top Overlay - Search Bar y Botón + */}
            <div className="absolute left-0 right-0 top-0 z-10 p-4 animate-in fade-in slide-in-from-top duration-500">
                <div className="mx-auto flex max-w-2xl items-center gap-3">
                    {/* Search Bar */}
                    <div
                        className={cn(
                            "relative flex-1 transition-all duration-300",
                            isSearchFocused ? "scale-[1.02]" : "scale-100",
                        )}
                    >
                        <Search
                            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300"
                            style={{ color: isSearchFocused ? "var(--brand-blue)" : "#6b7280" }}
                        />
                        <Input
                            type="text"
                            placeholder="Buscar un lugar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className={cn(
                                "h-14 rounded-2xl border-2 bg-white pl-12 pr-12 text-base shadow-lg transition-all duration-300 focus:shadow-xl",
                                isSearchFocused ? "border-[var(--brand-blue)]" : "border-transparent",
                            )}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition-all duration-200 hover:bg-gray-100 active:scale-95"
                            >
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Botón + */}
                    <Button
                        size="icon"
                        className="h-14 w-14 shrink-0 rounded-2xl bg-white text-gray-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95"
                        style={{
                            borderWidth: "2px",
                            borderColor: !isHiddenBadge ? "var(--brand-blue)" : "transparent",
                        }}
                        onClick={() => setIsHiddenBadge(!isHiddenBadge)}
                    >
                        <Plus className={cn("h-6 w-6 transition-transform duration-300", !isHiddenBadge && "rotate-45")} />
                        <span className="sr-only">{"Añadir publicación"}</span>
                    </Button>

                </div>
                {/* Aquí se renderiza ButtonSequence */}
                <div className="flex flex-col w-full items-end py-4 gap-3">
                    <ButtonSequence
                        isHiddenBadge={isHiddenBadge}
                        onPromotionClick={() => handleOpenSheet("promotion")}
                        onOfferClick={() => handleOpenSheet("offer")}
                    />
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 z-10 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="mx-auto max-w-2xl px-4 pb-safe">
                    <div className="mb-4 flex items-center justify-around rounded-3xl bg-white p-2 shadow-2xl">
                        {/* ... (tus botones de navegación: MapPin, User, Settings) ... */}
                        <button
                            onClick={() => setActiveTab("map")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-300",
                                activeTab === "map"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <MapPin className="h-6 w-6" />
                            <span className="text-xs font-medium">{"Mapa"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-300",
                                activeTab === "profile"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <User className="h-6 w-6" />
                            <span className="text-xs font-medium">{"Personal"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-300",
                                activeTab === "settings"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <Settings className="h-6 w-6" />
                            <span className="text-xs font-medium">{"Preferencias"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Paneles de Contenido (Profile / Settings) */}
            {/* ... (tus paneles de 'profile' y 'settings' van aquí, sin cambios) ... */}


            {/* --- BOTTOM SHEET --- */}
            {/* Se renderiza como un HIJO DIRECTO del div principal */}
            <AnimatePresence>
                {showBottomSheet && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 z-30 bg-black/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeSheet}
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 z-40"
                            style={{
                                height: `${sheetHeight}%`,
                                touchAction: "none",
                            }}
                            initial={{ y: "100%" }}
                            animate={{ y: "0%" }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 20, stiffness: 150 }}
                        >
                            <div className="mx-auto h-full max-w-2xl px-4">
                                <div className="flex h-full flex-col rounded-t-3xl bg-white shadow-2xl">
                                    {/* Drag Handle */}
                                    <div
                                        className="flex cursor-grab items-center justify-center py-4 active:cursor-grabbing"
                                        onTouchStart={handleDragStart}
                                        onMouseDown={handleDragStart}
                                    >
                                        <div className="h-1.5 w-12 rounded-full bg-gray-300 transition-colors hover:bg-gray-400" />
                                    </div>

                                    {/* Sheet Content */}
                                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                                        <div className="mb-6 flex items-center justify-between">
                                            <h2 className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>
                                                {selectedOption === "promotion" ? "Publicar Promoción" : "Publicar Descuentazo"}
                                            </h2>
                                            <button
                                                onClick={closeSheet}
                                                className="rounded-full p-2 transition-all hover:bg-gray-100 active:scale-95"
                                            >
                                                <X className="h-6 w-6 text-gray-500" />
                                            </button>
                                        </div>

                                        {/* Formulario (Contenido personalizado) */}
                                        <form className="space-y-4">
                                            {/* ... (tu formulario con Título, Descripción, Precio, etc.) ... */}
                                            <div>
                                                <Label htmlFor="title">{"Título"}</Label>
                                                <Input id="title" placeholder={selectedOption === "promotion" ? "Ej: 2x1 en Cafés" : "Ej: Audífonos a $100"} />
                                            </div>
                                            <div>
                                                <Label htmlFor="description">{"Descripción"}</Label>
                                                <Textarea id="description" placeholder="Añade detalles, condiciones, ubicación..." />
                                            </div>
                                            <div>
                                                <Label htmlFor="price">{"Precio (Opcional)"}</Label>
                                                <Input id="price" type="number" placeholder="$ 0.00" />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                style={{
                                                    backgroundColor: selectedOption === "promotion" ? "#D22E1E" : "#004878",
                                                    color: "white",
                                                }}
                                            >
                                                {"Publicar"}
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}