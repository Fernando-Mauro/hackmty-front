"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteCookie } from "@/lib/cookies"

export default function AppPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Eliminar la cookie de autenticación
    deleteCookie("authToken")
    
    // Redirigir al login
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>
            Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="transition-all hover:scale-105"
            style={{ borderColor: "var(--brand-red)", color: "var(--brand-red)" }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-4 text-3xl font-bold" style={{ color: "var(--brand-blue)" }}>
              ¡Bienvenido a tu aplicación!
            </h2>
            <p className="text-lg text-gray-600">
              Has iniciado sesión exitosamente. Esta es una ruta protegida.
            </p>
            
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div 
                className="rounded-lg p-6 text-white shadow-md"
                style={{ backgroundColor: "var(--brand-blue)" }}
              >
                <h3 className="text-xl font-semibold">Panel 1</h3>
                <p className="mt-2">Contenido protegido</p>
              </div>
              
              <div 
                className="rounded-lg p-6 text-white shadow-md"
                style={{ backgroundColor: "var(--brand-red)" }}
              >
                <h3 className="text-xl font-semibold">Panel 2</h3>
                <p className="mt-2">Contenido protegido</p>
              </div>
              
              <div 
                className="rounded-lg p-6 text-white shadow-md"
                style={{ backgroundColor: "var(--brand-blue)" }}
              >
                <h3 className="text-xl font-semibold">Panel 3</h3>
                <p className="mt-2">Contenido protegido</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2025 Tu Aplicación. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
