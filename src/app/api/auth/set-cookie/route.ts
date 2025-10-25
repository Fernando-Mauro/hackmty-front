// app/api/auth/set-cookie/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Leer el token que viene en el body
    const body = await request.json();
    const { token } = body;

    // 2. Validar que el token exista
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // 3. Establecer la cookie de forma segura
    // Usamos la función cookies() de 'next/headers'
    (await cookies()).set('token', token, {
      httpOnly: true, // La cookie no es accesible por JavaScript en el navegador
      secure: process.env.NODE_ENV === 'production', // Solo por HTTPS en producción
      sameSite: 'lax', // Protección contra ataques CSRF
      path: '/', // Disponible en todo el sitio
      maxAge: 60 * 60 * 24, // 1 día (ajústalo a la expiración de tu JWT)
    });

    // 4. Enviar respuesta de éxito
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('Error setting cookie:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}