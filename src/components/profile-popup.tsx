"use client"

import type React from "react"
import { X, User, Mail, Phone, MapPin, Settings, LogOut, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProfilePopupProps {
    onClose: () => void
}

export default function ProfilePopup({ onClose }: ProfilePopupProps) {
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
                                <h2 className="text-lg font-bold text-white">Profile</h2>
                                <p className="text-xs text-white/80">Tu información personal</p>
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
                    <div className="flex-1 overflow-y-auto">
                        {/* Profile Header */}
                        <div className="relative pb-16" style={{ backgroundColor: "var(--brand-blue)" }}>
                            <div className="flex flex-col items-center pt-6">
                                {/* Profile Picture */}
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                                        <User className="h-full w-full text-gray-400 p-6" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                                        <Edit className="h-5 w-5 text-[var(--brand-blue)]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info Card */}
                        <div className="px-6 -mt-12">
                            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-800">Usuario Demo</h3>
                                    <p className="text-sm text-gray-500">@usuario_demo</p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-[var(--brand-blue)]">24</p>
                                        <p className="text-xs text-gray-500">Promociones</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-[var(--brand-blue)]">156</p>
                                        <p className="text-xs text-gray-500">Puntos</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-[var(--brand-blue)]">12</p>
                                        <p className="text-xs text-gray-500">Guardados</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Options */}
                        <div className="px-6 py-6 space-y-3">
                            {/* Personal Info */}
                            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Información Personal</h4>
                                
                                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-[var(--brand-blue)]" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-800">Email</p>
                                        <p className="text-xs text-gray-500">usuario@example.com</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-800">Teléfono</p>
                                        <p className="text-xs text-gray-500">+52 123 456 7890</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-800">Ubicación</p>
                                        <p className="text-xs text-gray-500">Monterrey, NL</p>
                                    </div>
                                </button>
                            </div>

                            {/* Settings & Actions */}
                            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
                                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                                        <Settings className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-800">Configuración</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 transition-colors group">
                                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                                        <LogOut className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-red-600">Cerrar Sesión</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
