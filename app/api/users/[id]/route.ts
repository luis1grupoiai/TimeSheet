import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/users/[id]
 * Obtener un usuario por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        timeEntries: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            project: {
              select: {
                name: true,
              },
            },
          },
        },
        projects: {
          include: {
            project: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuario',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/users/[id]
 * Actualizar un usuario
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, role } = body

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Usuario actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar usuario',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/users/[id]
 * Eliminar un usuario
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar usuario',
      },
      { status: 500 }
    )
  }
}
