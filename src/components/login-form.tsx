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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      // 1) Obtener CSRF cookie (si aplica)
      const csrfRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      })
      if (!csrfRes.ok) {
        throw new Error("No se pudo obtener CSRF cookie")
      }

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
        throw new Error("Credenciales inválidas")
      }

      // 3) Extraer token del body o header y guardarlo en cookies
      let data: any = null
      try {
        data = await res.json()
      } catch {
        // puede venir vacío si el token está en headers
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
        throw new Error("No se recibió token en la respuesta")
      }

      // Importante: las cookies solo se envían al mismo dominio.
      // Si tu API está en el mismo dominio o subdominio, puedes ajustar 'domain' y SameSite.
      // Para uso cross-site, SameSite=None y Secure=true son necesarios.
      setCookie("authToken", token, {
        days: 7,
        // domain: ".tudominio.com", // opcional: ajusta si frontend y api comparten eTLD+1
        sameSite: "None",
        secure: true,
      })

      console.log("Login successful, token guardado en cookie.")
      
      router.push("/app")
      console.log("Redirigiendo a /app")
    } catch (error) {
      console.error("Error logging in:", error)
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
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
              src="/modern-abstract-geometric-pattern.jpg"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded transition-all"
                  style={{
                    accentColor: "var(--brand-blue)",
                  }}
                />
                <span className="text-sm text-muted-foreground">{"Remember me"}</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: "var(--brand-red)" }}
              >
                {"Forgot password?"}
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full transform text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--brand-blue)" }}
            >
              {isLoading ? "Iniciando sesión..." : "Sign In"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">{"Or continue with"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="transition-all duration-300 hover:scale-[1.02] hover:shadow-md bg-transparent"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {"Google"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="transition-all duration-300 hover:scale-[1.02] hover:shadow-md bg-transparent"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                {"GitHub"}
              </Button>
            </div>
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
