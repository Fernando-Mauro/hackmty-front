"use client"

import type React from "react"
import { X } from "lucide-react"
import Promos from "@/app/promos/page"

interface FeaturedPopupProps {
    onClose: () => void
}

export default function FeaturedPopup({ onClose }: FeaturedPopupProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 animate-in fade-in duration-300">
            <div className="h-full w-full animate-in slide-in-from-bottom duration-500">
                <div className="flex h-full flex-col bg-white">
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-6 py-4 shadow-md"
                        style={{ backgroundColor: "var(--brand-blue)" }}
                    >
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-white">Featured</h2>
                                <p className="text-xs text-white/80">Featured promotions</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="rounded-full p-2 transition-all hover:bg-white/20 active:scale-95"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <Promos/>
                </div>
            </div>
        </div>
    )
}
