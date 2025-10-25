"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Navigation, MapPin, User, Settings, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MapOverlay({
    children 
}: {
    children: React.ReactNode
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"map" | "profile" | "settings">("map")
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    return (
        <div className="relative h-screen w-full overflow-hidden bg-gray-100">
            {/* Map Container - Placeholder for your existing map */}
            {
                children
            }

            {/* Top Overlay - Search Bar and Compass */}
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
                            placeholder="Buscar"
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

                    {/* Compass Button */}
                    <Button
                        size="icon"
                        className="h-14 w-14 shrink-0 rounded-2xl bg-white text-gray-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95"
                        style={{
                            borderWidth: "2px",
                            borderColor: "transparent",
                        }}
                    >
                        <Navigation className="h-6 w-6" />
                        <span className="sr-only">{"Brújula"}</span>
                    </Button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 z-10 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="mx-auto max-w-2xl px-4 pb-safe">
                    <div className="mb-4 flex items-center justify-around rounded-3xl bg-white p-2 shadow-2xl">
                        {/* Map/Location Tab */}
                        <button
                            onClick={() => setActiveTab("map")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-300",
                                activeTab === "map"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <MapPin
                                className={cn(
                                    "h-6 w-6 transition-transform duration-300",
                                    activeTab === "map" ? "scale-110" : "group-hover:scale-105",
                                )}
                            />
                            <span className="text-xs font-medium">{"Mapa"}</span>
                            {activeTab === "map" && (
                                <div className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[var(--brand-red)] animate-in fade-in slide-in-from-bottom-2 duration-300" />
                            )}
                        </button>

                        {/* Profile Tab */}
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-300",
                                activeTab === "profile"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <User
                                className={cn(
                                    "h-6 w-6 transition-transform duration-300",
                                    activeTab === "profile" ? "scale-110" : "group-hover:scale-105",
                                )}
                            />
                            <span className="text-xs font-medium">{"Personal"}</span>
                            {activeTab === "profile" && (
                                <div className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[var(--brand-red)] animate-in fade-in slide-in-from-bottom-2 duration-300" />
                            )}
                        </button>

                        {/* Settings Tab */}
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={cn(
                                "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-300",
                                activeTab === "settings"
                                    ? "bg-[var(--brand-blue)] text-white shadow-lg"
                                    : "text-gray-500 hover:bg-gray-50 active:scale-95",
                            )}
                        >
                            <Settings
                                className={cn(
                                    "h-6 w-6 transition-transform duration-300",
                                    activeTab === "settings" ? "scale-110 rotate-90" : "group-hover:scale-105 group-hover:rotate-45",
                                )}
                            />
                            <span className="text-xs font-medium">{"Preferencias"}</span>
                            {activeTab === "settings" && (
                                <div className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[var(--brand-red)] animate-in fade-in slide-in-from-bottom-2 duration-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Panels - Slide up from bottom based on active tab */}
            {activeTab === "profile" && (
                <div className="absolute bottom-28 left-0 right-0 z-20 animate-in slide-in-from-bottom-full duration-500">
                    <div className="mx-auto max-w-2xl px-4">
                        <div className="rounded-t-3xl bg-white p-6 shadow-2xl">
                            <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--brand-blue)" }}>
                                {"Personal"}
                            </h2>
                            <div className="space-y-3">
                                <button className="w-full rounded-xl bg-gray-50 p-4 text-left transition-all hover:bg-gray-100 active:scale-98">
                                    <p className="font-medium text-gray-900">{"Favoritos"}</p>
                                </button>
                                <button className="w-full rounded-xl bg-gray-50 p-4 text-left transition-all hover:bg-gray-100 active:scale-98">
                                    <p className="font-medium text-gray-900">{"Carpool (lista)"}</p>
                                </button>
                                <button className="w-full rounded-xl bg-gray-50 p-4 text-left transition-all hover:bg-gray-100 active:scale-98">
                                    <p className="font-medium text-gray-900">{"Presupuesto (Edita)"}</p>
                                </button>
                                <button className="w-full rounded-xl bg-gray-50 p-4 text-left transition-all hover:bg-gray-100 active:scale-98">
                                    <p className="font-medium text-gray-900">{"Ruta"}</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="absolute bottom-28 left-0 right-0 z-20 animate-in slide-in-from-bottom-full duration-500">
                    <div className="mx-auto max-w-2xl px-4">
                        <div className="rounded-t-3xl bg-white p-6 shadow-2xl">
                            <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--brand-blue)" }}>
                                {"Preferencias"}
                            </h2>
                            <div className="space-y-3">
                                <button className="w-full rounded-xl bg-gray-50 p-4 text-left transition-all hover:bg-gray-100 active:scale-98">
                                    <p className="font-medium text-gray-900">{"Referencias"}</p>
                                </button>
                                <button className="w-full rounded-xl bg-gray-50 p-4 text-left transition-all hover:bg-gray-100 active:scale-98">
                                    <p className="font-medium text-gray-900">{"Info"}</p>
                                </button>
                                <button className="w-full rounded-xl bg-gray-50 p-4 text-left transition-all hover:bg-gray-100 active:scale-98">
                                    <p className="font-medium text-gray-900">{"Ayuda"}</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
