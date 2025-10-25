import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  console.log('Middleware - Token:', token)

  if (pathname === '/') {
    if (token) {
      const isValid = await verifyToken(token)
      if (isValid) {
        return NextResponse.redirect(new URL('/app', request.url))
      } else {
        const response = NextResponse.next()
        response.cookies.delete('authToken')
        return response
      }
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/app')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const isValid = await verifyToken(token)
    if (!isValid) {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('authToken')
      return response
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

async function verifyToken(token: string): Promise<boolean> {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       cache: 'no-store',
//       credentials: 'include',
//     })
//     // log the complete response
//     console.log('Middleware - Verify Token Response:', await response.json())
//     return response.ok
//   } catch (error) {
//     console.error('Error verifying token:', error)
//     return false
//   }
    return true;
}

export const config = {
  matcher: [
    '/',
    '/app/:path*',
  ],
}
