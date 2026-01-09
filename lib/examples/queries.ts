/**
 * EJEMPLOS DE CONSULTAS CON PRISMA
 *
 * Este archivo contiene ejemplos de las operaciones más comunes
 * que puedes realizar con Prisma.
 */

import { prisma } from '../prisma'

// ============================================
// 1. CREAR (CREATE)
// ============================================

/**
 * Crear un nuevo usuario
 */
export async function createUser() {
  const user = await prisma.user.create({
    data: {
      email: 'juan@ejemplo.com',
      name: 'Juan Pérez',
      role: 'EMPLOYEE',
    },
  })
  console.log('Usuario creado:', user)
  return user
}

/**
 * Crear un proyecto con miembros
 */
export async function createProjectWithMembers() {
  const project = await prisma.project.create({
    data: {
      name: 'Proyecto Web',
      description: 'Desarrollo de aplicación web',
      status: 'ACTIVE',
      members: {
        create: [
          {
            userId: 'user-id-aqui', // Reemplazar con ID real
            role: 'manager',
          },
        ],
      },
    },
    include: {
      members: true, // Incluye los miembros en el resultado
    },
  })
  console.log('Proyecto creado:', project)
  return project
}

/**
 * Crear una entrada de tiempo
 */
export async function createTimeEntry(userId: string, projectId: string) {
  const timeEntry = await prisma.timeEntry.create({
    data: {
      userId,
      projectId,
      description: 'Desarrollo de feature de login',
      hours: 3.5,
      date: new Date(),
    },
  })
  console.log('Entrada de tiempo creada:', timeEntry)
  return timeEntry
}

// ============================================
// 2. LEER (READ/FIND)
// ============================================

/**
 * Obtener todos los usuarios
 */
export async function getAllUsers() {
  const users = await prisma.user.findMany()
  console.log('Todos los usuarios:', users)
  return users
}

/**
 * Obtener un usuario por email
 */
export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  console.log('Usuario encontrado:', user)
  return user
}

/**
 * Obtener usuarios con sus entradas de tiempo
 */
export async function getUsersWithTimeEntries() {
  const users = await prisma.user.findMany({
    include: {
      timeEntries: {
        orderBy: { date: 'desc' },
        take: 5, // Solo las últimas 5 entradas
      },
    },
  })
  console.log('Usuarios con entradas de tiempo:', users)
  return users
}

/**
 * Buscar proyectos activos
 */
export async function getActiveProjects() {
  const projects = await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
    },
    include: {
      members: {
        include: {
          user: true, // Incluir información del usuario
        },
      },
    },
  })
  console.log('Proyectos activos:', projects)
  return projects
}

/**
 * Obtener entradas de tiempo con filtros
 */
export async function getTimeEntriesByDateRange(startDate: Date, endDate: Date) {
  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      date: {
        gte: startDate, // Mayor o igual que
        lte: endDate,   // Menor o igual que
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      project: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  })
  console.log('Entradas de tiempo:', timeEntries)
  return timeEntries
}

// ============================================
// 3. ACTUALIZAR (UPDATE)
// ============================================

/**
 * Actualizar información de un usuario
 */
export async function updateUser(userId: string, name: string) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name },
  })
  console.log('Usuario actualizado:', updatedUser)
  return updatedUser
}

/**
 * Actualizar estado de un proyecto
 */
export async function updateProjectStatus(projectId: string, status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED') {
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { status },
  })
  console.log('Proyecto actualizado:', updatedProject)
  return updatedProject
}

/**
 * Actualizar horas de una entrada de tiempo
 */
export async function updateTimeEntryHours(timeEntryId: string, hours: number) {
  const updatedEntry = await prisma.timeEntry.update({
    where: { id: timeEntryId },
    data: { hours },
  })
  console.log('Entrada de tiempo actualizada:', updatedEntry)
  return updatedEntry
}

// ============================================
// 4. ELIMINAR (DELETE)
// ============================================

/**
 * Eliminar un usuario (también elimina sus entradas de tiempo por cascade)
 */
export async function deleteUser(userId: string) {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  })
  console.log('Usuario eliminado:', deletedUser)
  return deletedUser
}

/**
 * Eliminar una entrada de tiempo
 */
export async function deleteTimeEntry(timeEntryId: string) {
  const deletedEntry = await prisma.timeEntry.delete({
    where: { id: timeEntryId },
  })
  console.log('Entrada de tiempo eliminada:', deletedEntry)
  return deletedEntry
}

/**
 * Eliminar múltiples entradas de tiempo
 */
export async function deleteTimeEntriesByDate(date: Date) {
  const result = await prisma.timeEntry.deleteMany({
    where: {
      date: {
        lt: date, // Menor que la fecha especificada
      },
    },
  })
  console.log(`${result.count} entradas eliminadas`)
  return result
}

// ============================================
// 5. CONSULTAS AVANZADAS
// ============================================

/**
 * Contar total de horas por proyecto
 */
export async function getTotalHoursByProject(projectId: string) {
  const result = await prisma.timeEntry.aggregate({
    where: { projectId },
    _sum: {
      hours: true,
    },
    _count: {
      id: true,
    },
  })
  console.log('Total de horas:', result._sum.hours)
  console.log('Total de entradas:', result._count.id)
  return result
}

/**
 * Obtener estadísticas por usuario
 */
export async function getUserStats(userId: string) {
  const stats = await prisma.timeEntry.groupBy({
    by: ['projectId'],
    where: { userId },
    _sum: {
      hours: true,
    },
    _count: {
      id: true,
    },
  })
  console.log('Estadísticas del usuario:', stats)
  return stats
}

/**
 * Buscar con condiciones complejas
 */
export async function searchTimeEntries(searchTerm: string) {
  const entries = await prisma.timeEntry.findMany({
    where: {
      OR: [
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive', // Búsqueda sin distinguir mayúsculas
          },
        },
        {
          project: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      user: true,
      project: true,
    },
  })
  console.log('Resultados de búsqueda:', entries)
  return entries
}

/**
 * Transacción: Crear proyecto y asignar miembros
 */
export async function createProjectWithTransaction(
  projectName: string,
  userIds: string[]
) {
  const result = await prisma.$transaction(async (tx) => {
    // Crear el proyecto
    const project = await tx.project.create({
      data: {
        name: projectName,
        status: 'ACTIVE',
      },
    })

    // Asignar miembros
    await tx.projectMember.createMany({
      data: userIds.map(userId => ({
        userId,
        projectId: project.id,
        role: 'member',
      })),
    })

    return project
  })

  console.log('Proyecto creado con transacción:', result)
  return result
}

// ============================================
// 6. PAGINACIÓN
// ============================================

/**
 * Obtener usuarios con paginación
 */
export async function getUsersPaginated(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ])

  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}
