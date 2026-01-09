import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/users
 * Obtener todos los usuarios
 */
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuarios',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/users
 * Crear un nuevo usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role } = body

    // Validación básica
    if (!email || !name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email y nombre son requeridos',
        },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'El email ya está registrado',
        },
        { status: 409 }
      )
    }

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role || 'EMPLOYEE',
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: 'Usuario creado exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear usuario',
      },
      { status: 500 }
    )
  }
}
