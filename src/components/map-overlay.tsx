"use client"

// --- IMPORTS COMBINADOS ---
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion" // We don't need 'Variants' here
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, MapPin, User, Plus, X, MessageCircleDashed, Flame, ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonSequence } from "./button-sequence" // Importamos el hijo
import Image from "next/image"
import { useRouter } from "next/navigation"
import MealChat from "./meal-chat"
import FeaturedPopup from "./featured-popup"
import ProfilePopup from "./profile-popup"

interface Place {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export default function MapOverlay({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [dayOfWeek, setDayOfWeek] = useState<number | null>(null);

    const dayOptions = [
        { id: 1, label: 'L' },
        { id: 2, label: 'M' },
        { id: 3, label: 'M' },
        { id: 4, label: 'J' },
        { id: 5, label: 'V' },
        { id: 6, label: 'S' },
        { id: 0, label: 'D' },
    ];

    const specialDayOptions = [
        { id: 7, label: 'Every day' },
        { id: 8, label: 'Weekends' },
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Usamos FileReader para obtener un Data URL (base64)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        // Reset the input value in case the user
        // wants to upload the SAME image again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        const fetchPlaces = async () => {
            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getPlaces`);
            const places = await data.json();
            setPlaces(places);
        };

        fetchPlaces();
    }, []);

    // --- Estados de Archivo 1 ---
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"map" | "profile" | "meal" | "featured">("map")
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [isHiddenBadge, setIsHiddenBadge] = useState(true);

    // Helper to check if navigation should be hidden
    const shouldHideNavigation = activeTab === "meal" || activeTab === "featured" || activeTab === "profile";

    // --- Estados de DRAG (de Archivo 3) ---
    const [showBottomSheet, setShowBottomSheet] = useState(false)
    const [selectedOption, setSelectedOption] = useState<"promotion" | "offer" | null>(null)
    const [sheetHeight, setSheetHeight] = useState(50) // percentage
    const [isDragging, setIsDragging] = useState(false)
    const dragStartY = useRef(0)
    const dragStartHeight = useRef(0)

    // --- Form feedback states ---
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    // --- Handlers de DRAG (de Archivo 3) ---
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true)
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
        dragStartY.current = clientY
        dragStartHeight.current = sheetHeight
    }

    const handleDragMove = (e: TouchEvent | MouseEvent) => {
        if (!isDragging) return
        e.preventDefault(); // Prevents page scroll
        const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
        const deltaY = dragStartY.current - clientY
        const windowHeight = window.innerHeight
        const deltaPercent = (deltaY / windowHeight) * 100
        const newHeight = Math.min(Math.max(dragStartHeight.current + deltaPercent, 20), 90) // Limit 20% - 90%
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


    const handleOpenSheet = (option: "promotion" | "offer") => {
        setSelectedOption(option)
        setShowBottomSheet(true)
        setSheetHeight(50) // Empezar al 50%
        setIsHiddenBadge(true); // Ocultar los botones de nuevo
    }

    // --- Function to CLOSE the Sheet ---
    const closeSheet = () => {
        setShowBottomSheet(false)
        setSheetHeight(50) // Resetear altura
    }

    // handle the form submission
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset estados
        setIsSubmitting(true);
        setSubmitStatus("idle");
        setErrorMessage("");

        try {
            const formData = new FormData(e.target as HTMLFormElement);

            // add the additional fields
            formData.append("start_time", startTime);
            formData.append("end_time", endTime);
            formData.append("day_of_week", dayOfWeek !== null ? dayOfWeek.toString() : "");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createDiscount`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            // Success!
            setSubmitStatus("success");
            
            // Reset form after 2 seconds
            setTimeout(() => {
                setSubmitStatus("idle");
                closeSheet();
                // Reset form fields
                setStartTime("");
                setEndTime("");
                setDayOfWeek(null);
                setImagePreview(null);
                (e.target as HTMLFormElement).reset();
            }, 2000);

        } catch (error) {
            setSubmitStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Error posting promotion");
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Store activeTab value to avoid TypeScript narrowing issues
    const currentTab = activeTab;
    
    return (
        <div className="relative h-screen w-full overflow-hidden bg-gray-100">
            {/* El Mapa (child) se renderiza aquí */}
            {
                children
            }

            {/* Top Overlay - Search Bar y Botón + */}
            {!shouldHideNavigation && (
            <div className="absolute left-0 right-0 top-0 z-10 p-3 sm:p-4 md:p-6 animate-in fade-in slide-in-from-top duration-500">
                <div className="mx-auto flex max-w-2xl items-center gap-2 sm:gap-3">
                    {/* Search Bar */}
                    <div
                        className={cn(
                            "relative flex-1 transition-all duration-300",
                            isSearchFocused ? "scale-[1.02]" : "scale-100",
                        )}
                    >
                        <Search
                            className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-colors duration-300"
                            style={{ color: isSearchFocused ? "var(--brand-blue)" : "#6b7280" }}
                        />
                        <Input
                            type="text"
                            placeholder="Search for a place"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className={cn(
                                "h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 bg-white pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base shadow-lg transition-all duration-300 focus:shadow-xl",
                                isSearchFocused ? "border-[var(--brand-blue)]" : "border-transparent",
                            )}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition-all duration-200 hover:bg-gray-100 active:scale-95"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Botón + */}
                    <Button
                        size="icon"
                        className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl bg-white text-gray-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95"
                        style={{
                            borderWidth: "2px",
                            borderColor: !isHiddenBadge ? "var(--brand-blue)" : "transparent",
                        }}
                        onClick={() => setIsHiddenBadge(!isHiddenBadge)}
                    >
                        <Plus className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300", !isHiddenBadge && "rotate-45")} />
                        <span className="sr-only">{"Add post"}</span>
                    </Button>

                </div>
                {/* Aquí se renderiza ButtonSequence */}
                <div className="flex flex-col w-full items-end py-3 sm:py-4 gap-2 sm:gap-3">
                    <ButtonSequence
                        isHiddenBadge={isHiddenBadge}
                        onPromotionClick={() => handleOpenSheet("promotion")}
                        onOfferClick={() => handleOpenSheet("offer")}
                    />
                </div>
            </div>
            )}

            {/* Bottom Navigation */}
            {!shouldHideNavigation && (
            <div className="absolute bottom-0 left-0 right-0 z-10 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="mx-auto max-w-2xl px-3 sm:px-4 pb-safe">
                    <div className="mb-3 sm:mb-4 flex items-center justify-around rounded-2xl sm:rounded-3xl bg-white p-1.5 sm:p-2 shadow-2xl">
                        {/* ... (tus botones de navegación: MapPin, User, Settings) ... */}
                        <button
                            onClick={() => setActiveTab("map")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-0.5 sm:gap-1 rounded-xl sm:rounded-2xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-300",
                                activeTab === "map"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="text-[10px] sm:text-xs font-medium">{"Map"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("meal")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-0.5 sm:gap-1 rounded-xl sm:rounded-2xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-300",
                                // Note: this bottom bar is not shown when activeTab === "meal",
                                // so this button is never in "active" state here.
                                "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <MessageCircleDashed className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="text-[10px] sm:text-xs font-medium">{"Meal plan"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("featured")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-0.5 sm:gap-1 rounded-xl sm:rounded-2xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-300",
                                currentTab === "featured"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <Flame className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="text-[10px] sm:text-xs font-medium">{"Featured"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-0.5 sm:gap-1 rounded-xl sm:rounded-2xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-300",
                                currentTab === "profile"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <User className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="text-[10px] sm:text-xs font-medium">{"Profile"}</span>
                        </button>

                    </div>
                </div>
            </div>
            )}

            {/* Fullscreen Meal Plan Popup */}
            <AnimatePresence>
                {activeTab === "meal" && (
                    <motion.div
                        className="absolute inset-0 z-50 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex h-full w-full flex-col">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="text-base sm:text-lg font-semibold" style={{ color: "var(--brand-blue)" }}>Meal plan</h2>
                                <button
                                    onClick={() => setActiveTab("map")}
                                    className="rounded-full p-1.5 sm:p-2 transition-all hover:bg-gray-100 active:scale-95"
                                >
                                    <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                                </button>
                            </div>
                            <MealChat onClose={() => setActiveTab("map")} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Featured Popup */}
            <AnimatePresence>
                {activeTab === "featured" && (
                    <motion.div
                        className="absolute inset-0 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FeaturedPopup onClose={() => setActiveTab("map")} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Profile Popup */}
            <AnimatePresence>
                {activeTab === "profile" && (
                    <motion.div
                        className="absolute inset-0 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ProfilePopup onClose={() => setActiveTab("map")} />
                    </motion.div>
                )}
            </AnimatePresence>

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
                            <div className="mx-auto h-full max-w-2xl px-3 sm:px-4">
                                <div className="flex h-full flex-col rounded-t-2xl sm:rounded-t-3xl bg-white shadow-2xl">
                                    {/* Drag Handle */}
                                    <div
                                        className="flex cursor-grab items-center justify-center py-3 sm:py-4 active:cursor-grabbing"
                                        onTouchStart={handleDragStart}
                                        onMouseDown={handleDragStart}
                                    >
                                        <div className="h-1 sm:h-1.5 w-10 sm:w-12 rounded-full bg-gray-300 transition-colors hover:bg-gray-400" />
                                    </div>

                                    {/* Post some */}
                                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
                                        <div className="mb-4 sm:mb-6 flex items-center justify-between">
                                            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>
                                                {selectedOption === "promotion" ? "Post Promotion" : "Post Offer"}
                                            </h2>
                                            <button
                                                onClick={closeSheet}
                                                className="rounded-full p-1.5 sm:p-2 transition-all hover:bg-gray-100 active:scale-95"
                                            >
                                                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                                            </button>
                                        </div>

                                        {
                                            selectedOption === "promotion" ? (
                                                <form className="space-y-3 sm:space-y-4" onSubmit={handleFormSubmit}>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="title" className="text-sm sm:text-base">{"Title"}</Label>
                                                        <Input 
                                                            id="title" 
                                                            name="title" 
                                                            required 
                                                            placeholder={"Example: 2x1 in Coffee"}
                                                            className="h-10 sm:h-12 text-sm sm:text-base"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="description" className="text-sm sm:text-base">{"Description"}</Label>
                                                        <Textarea 
                                                            required 
                                                            id="description" 
                                                            name="description" 
                                                            placeholder="Add details, conditions, location..."
                                                            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="price" className="text-sm sm:text-base">{"Price"}</Label>
                                                        <Input 
                                                            required 
                                                            id="price" 
                                                            name="price" 
                                                            type="number" 
                                                            placeholder="$ 0.00"
                                                            className="h-10 sm:h-12 text-sm sm:text-base"
                                                        />
                                                    </div>


                                                    {/* select input for where is the promotion */}
                                                    <div className="space-y-1">
                                                        <Label htmlFor="location" className="text-sm sm:text-base">{"Location"}</Label>
                                                        <select 
                                                            name="place_id" 
                                                            className="w-full border border-gray-300 rounded-md p-2 sm:p-2.5 text-sm sm:text-base h-10 sm:h-12"
                                                        >
                                                            {places.map((place) => (
                                                                <option key={place.id} value={place.id}>
                                                                    {place.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                        <div className="space-y-1 sm:space-y-2">
                                                            <Label htmlFor="start_time" className="mb-1 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                                                                {"Hora de Inicio"}
                                                            </Label>
                                                            <Input
                                                                id="start_time"
                                                                type="time"
                                                                name="start_time"
                                                                value={startTime}
                                                                onChange={(e) => setStartTime(e.target.value)}
                                                                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-[var(--brand-blue)] text-sm sm:text-base"
                                                            />
                                                        </div>
                                                        <div className="space-y-1 sm:space-y-2">
                                                            <Label htmlFor="end_time" className="mb-1 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                                                                {"Hora de Fin"}
                                                            </Label>
                                                            <Input
                                                                id="end_time"
                                                                type="time"
                                                                name="end_time"
                                                                value={endTime}
                                                                onChange={(e) => setEndTime(e.target.value)}
                                                                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-[var(--brand-blue)] text-sm sm:text-base"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* --- SELECTOR DE DÍA --- */}
                                                    <div className="space-y-1 sm:space-y-2">
                                                        <Label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                                                            Days of the week
                                                        </Label>

                                                        {/* Los 7 botones de días */}
                                                        <div className="flex justify-between gap-1">
                                                            {dayOptions.map((day) => (
                                                                <Button
                                                                    key={day.id}
                                                                    type="button"
                                                                    onClick={() => setDayOfWeek(day.id)}
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full transition-all text-xs sm:text-sm", // Botones redondos
                                                                        dayOfWeek === day.id
                                                                            ? "bg-[var(--brand-blue)] text-white scale-105 shadow-md"
                                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                    )}
                                                                >
                                                                    {day.label}
                                                                </Button>
                                                            ))}
                                                        </div>

                                                        {/* Los 2 botones especiales */}
                                                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                                                            {specialDayOptions.map((day) => (
                                                                <Button
                                                                    key={day.id}
                                                                    type="button"
                                                                    onClick={() => setDayOfWeek(day.id)}
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "h-9 sm:h-11 rounded-lg sm:rounded-xl text-[11px] sm:text-sm transition-all",
                                                                        dayOfWeek === day.id
                                                                            ? "bg-[var(--brand-blue)] text-white scale-105 shadow-md"
                                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                    )}
                                                                >
                                                                    {day.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 sm:space-y-2">
                                                        <Label htmlFor="image" className="text-sm sm:text-base">{"Image"}</Label>

                                                        {imagePreview ? (
                                                            // --- 1. ESTADO DE VISTA PREVIA ---
                                                            <div className="relative group w-full h-36 sm:h-48 md:h-56 rounded-lg sm:rounded-xl overflow-hidden">
                                                                <Image
                                                                    src={imagePreview}
                                                                    alt="Previews"
                                                                    fill
                                                                    className="object-cover transition-transform group-hover:scale-105"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    onClick={handleRemoveImage}
                                                                    className="absolute top-2 right-2 rounded-full h-7 w-7 sm:h-8 sm:w-8 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                    <span className="sr-only">{"Remove image"}</span>
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            // --- 2. ESTADO INICIAL (DROPZONE) ---
                                                            <div
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="w-full h-36 sm:h-48 md:h-56 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300
                       flex flex-col items-center justify-center
                       text-gray-500 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]
                       transition-colors duration-200 cursor-pointer bg-gray-50/50"
                                                            >
                                                                <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 mb-2" />
                                                                <span className="font-medium text-xs sm:text-sm">{"Click to upload an image"}</span>
                                                                <span className="text-[10px] sm:text-xs text-gray-400">{"PNG, JPG, GIF (Max. 5MB)"}</span>
                                                            </div>
                                                        )}

                                                        {/* Input de archivo real, pero oculto */}
                                                        <Input
                                                            required
                                                            ref={fileInputRef}
                                                            id="image" // El 'id' coincide con el 'htmlFor' del Label
                                                            type="file"
                                                            name="image"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden" // Key! Hide the ugly input
                                                        />
                                                    </div>
                                                    {/* Mensaje de estado */}
                                                    {submitStatus === "success" && (
                                                        <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top duration-300">
                                                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                                                            <p className="text-xs sm:text-sm text-green-700 font-medium">
                                                                Promotion posted successfully!
                                                            </p>
                                                        </div>
                                                    )}

                                                    {submitStatus === "error" && (
                                                        <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top duration-300">
                                                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0" />
                                                            <div className="flex-1">
                                                                <p className="text-xs sm:text-sm text-red-700 font-medium">
                                                                    Error posting
                                                                </p>
                                                                {errorMessage && (
                                                                    <p className="text-[10px] sm:text-xs text-red-600 mt-1">
                                                                        {errorMessage}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting || submitStatus === "success"}
                                                        className="w-full relative h-10 sm:h-12 text-sm sm:text-base"
                                                        style={{
                                                            backgroundColor: 
                                                                submitStatus === "success" ? "#10b981" :
                                                                submitStatus === "error" ? "#ef4444" :
                                                                selectedOption === "promotion" ? "#D22E1E" : "#004878",
                                                            color: "white",
                                                            opacity: isSubmitting ? 0.7 : 1,
                                                        }}
                                                    >
                                                        {isSubmitting && (
                                                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                                                        )}
                                                        {submitStatus === "success" && (
                                                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                                        )}
                                                        {submitStatus === "error" && (
                                                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                                        )}
                                                        {isSubmitting ? "Publishing..." : 
                                                         submitStatus === "success" ? "Published!" :
                                                         submitStatus === "error" ? "Retry" :
                                                         "Publish"}
                                                    </Button>
                                                </form>
                                            ) : (
                                                <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
                                                    {"Offer an irresistible big discount and stand out from the competition."}
                                                </p>
                                            )
                                        }
                                        {/* Formulario (Contenido personalizado) */}

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