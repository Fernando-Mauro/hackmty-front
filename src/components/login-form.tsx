"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { setCookie } from "@/lib/cookies"

export default function LoginForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [email, setEmail] = useState("judge@example.com")
    const [password, setPassword] = useState("12345678")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // // 1) Obtener CSRF cookie (si aplica)
            // const csrfRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
            //   method: "GET",
            //   credentials: "include",
            // })
            // if (!csrfRes.ok) {
            //   throw new Error("No se pudo obtener CSRF cookie")
            // }

            // 2) Login
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            })


            if (!res.ok) {
                throw new Error("Invalid credentials")
            }

            let data: any = null
            try {
                data = await res.json()
            } catch {
                // may come empty if token is in headers
            }

            let token: string | undefined =
                data?.token ??
                data?.access_token ??
                data?.data?.token

            if (!token) {
                const headerToken =
                    res.headers.get("Authorization") ||
                    res.headers.get("authorization") ||
                    res.headers.get("X-Auth-Token")
                if (headerToken) {
                    token = headerToken.startsWith("Bearer ")
                        ? headerToken.slice(7)
                        : headerToken
                }
            }

            if (!token) {
                throw new Error("No token received in response")
            }

            // Important: cookies are only sent to the same domain.
            // If your API is on the same domain or subdomain, you can adjust 'domain' and SameSite.
            // For cross-site use, SameSite=None and Secure=true are necessary.

            await fetch("/api/auth/set-cookie", {
                method: "POST",
                body: JSON.stringify({ token }),
                headers: { "Content-Type": "application/json" },
            });

            setCookie("authToken", token, {
                days: 7,
                // domain: ".tudominio.com", // opcional: ajusta si frontend y api comparten eTLD+1
                sameSite: "None",
                secure: true,
            })

            console.log("Login successful, token guardado en cookie.")

            router.push("/app")
            console.log("Redirecting to /app")
        } catch (error) {
            console.error("Error logging in:", error)
            setError(error instanceof Error ? error.message : "Error logging in")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Image Placeholder */}
            <div className="relative hidden w-1/2 overflow-hidden lg:block" style={{ backgroundColor: "var(--brand-blue)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="absolute h-96 w-96 rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out"
                        style={{
                            backgroundColor: "var(--brand-red)",
                            left: `${mousePosition.x / 20}px`,
                            top: `${mousePosition.y / 20}px`,
                        }}
                    />
                    <div className="relative z-10 animate-float">
                        <img
                            src="/logo.PNG"
                            alt="Login illustration"
                            className="h-auto w-full max-w-md opacity-90"
                        />
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-10 left-10 text-white">
                    <h2 className="text-balance text-4xl font-bold leading-tight">{"Welcome Back"}</h2>
                    <p className="mt-4 text-pretty text-lg opacity-90">{"Sign in to continue your journey"}</p>
                </div>

                {/* Animated accent line */}
                <div className="absolute bottom-0 h-1 w-full" style={{ backgroundColor: "var(--brand-red)" }}>
                    <div className="animate-shimmer h-full w-full" />
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div
                            className="mb-2 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white"
                            style={{ backgroundColor: "var(--brand-blue)" }}
                        >
                            {"Login"}
                        </div>
                        <h1 className="text-balance text-4xl font-bold leading-tight" style={{ color: "var(--brand-blue)" }}>
                            {"Sign in to your account"}
                        </h1>
                        <p className="mt-2 text-pretty text-muted-foreground">{"Enter your credentials to access your account"}</p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150"
                    >
                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                {"Email Address"}
                            </Label>
                            <div className="relative group">
                                <Mail
                                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors"
                                    style={{ color: isHovering ? "var(--brand-blue)" : "#9ca3af" }}
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 transition-all duration-300 focus:ring-2"
                                    style={{
                                        borderColor: isHovering ? "var(--brand-blue)" : undefined,
                                    }}
                                    onFocus={() => setIsHovering(true)}
                                    onBlur={() => setIsHovering(false)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                {"Password"}
                            </Label>
                            <div className="relative group">
                                <Lock
                                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors"
                                    style={{ color: isHovering ? "var(--brand-blue)" : "#9ca3af" }}
                                />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 transition-all duration-300 focus:ring-2"
                                    style={{
                                        borderColor: isHovering ? "var(--brand-blue)" : undefined,
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                                    style={{ color: "var(--brand-blue)" }}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full transform text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: "var(--brand-blue)" }}
                        >
                            {isLoading ? "Login..." : "Sign In"}
                        </Button>

                        
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
                        {"Don't have an account? "}
                        <a href="#" className="font-medium transition-colors hover:underline" style={{ color: "var(--brand-red)" }}>
                            {"Sign up"}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
