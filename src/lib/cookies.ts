// Utilidades para manejar cookies en el cliente

type CookieOptions = {
  days?: number
  domain?: string
  secure?: boolean
  sameSite?: "Lax" | "Strict" | "None"
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const {
    days = 7,
    domain,
    secure = true,
    sameSite = "None",
  } = options
  
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  let cookie = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires}; SameSite=${sameSite}`
  
  if (secure) cookie += "; Secure"
  if (domain) cookie += `; Domain=${domain}`
  
  document.cookie = cookie
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  
  return null
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure`
}
