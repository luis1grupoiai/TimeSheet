/**
 * SEED FILE - Datos de ejemplo para la base de datos
 *
 * Este archivo se usa para poblar la base de datos con datos iniciales.
 * Ejecuta: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (opcional)
  await prisma.timeEntry.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Datos antiguos eliminados')

  // Crear usuarios
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@timesheet.com',
      name: 'Administrador',
      role: 'ADMIN',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'juan.perez@timesheet.com',
      name: 'Juan Pérez',
      role: 'EMPLOYEE',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'maria.garcia@timesheet.com',
      name: 'María García',
      role: 'MANAGER',
    },
  })

  console.log('✅ 3 usuarios creados')

  // Crear proyectos
  const project1 = await prisma.project.create({
    data: {
      name: 'Desarrollo Web',
      description: 'Proyecto de desarrollo de aplicación web con Next.js',
      status: 'ACTIVE',
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'App Mobile',
      description: 'Aplicación móvil para iOS y Android',
      status: 'ACTIVE',
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'Migración Legacy',
      description: 'Migración de sistema legacy a nueva arquitectura',
      status: 'COMPLETED',
    },
  })

  console.log('✅ 3 proyectos creados')

  // Asignar miembros a proyectos
  await prisma.projectMember.createMany({
    data: [
      {
        userId: user1.id,
        projectId: project1.id,
        role: 'manager',
      },
      {
        userId: user2.id,
        projectId: project1.id,
        role: 'developer',
      },
      {
        userId: user3.id,
        projectId: project2.id,
        role: 'manager',
      },
      {
        userId: user2.id,
        projectId: project2.id,
        role: 'developer',
      },
    ],
  })

  console.log('✅ Miembros asignados a proyectos')

  // Crear entradas de tiempo
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  await prisma.timeEntry.createMany({
    data: [
      // Entradas para Juan Pérez
      {
        userId: user2.id,
        projectId: project1.id,
        description: 'Implementación de autenticación',
        hours: 4.5,
        date: today,
      },
      {
        userId: user2.id,
        projectId: project1.id,
        description: 'Revisión de código y testing',
        hours: 3.0,
        date: yesterday,
      },
      {
        userId: user2.id,
        projectId: project2.id,
        description: 'Diseño de interfaces',
        hours: 5.0,
        date: yesterday,
      },
      {
        userId: user2.id,
        projectId: project1.id,
        description: 'Desarrollo de API REST',
        hours: 6.5,
        date: lastWeek,
      },
      // Entradas para María García
      {
        userId: user3.id,
        projectId: project2.id,
        description: 'Reunión de planificación',
        hours: 2.0,
        date: today,
      },
      {
        userId: user3.id,
        projectId: project2.id,
        description: 'Revisión de arquitectura',
        hours: 4.0,
        date: yesterday,
      },
      // Entradas para Administrador
      {
        userId: user1.id,
        projectId: project1.id,
        description: 'Setup inicial del proyecto',
        hours: 3.5,
        date: lastWeek,
      },
    ],
  })

  console.log('✅ 7 entradas de tiempo creadas')

  // Mostrar resumen
  const totalUsers = await prisma.user.count()
  const totalProjects = await prisma.project.count()
  const totalTimeEntries = await prisma.timeEntry.count()
  const totalHours = await prisma.timeEntry.aggregate({
    _sum: { hours: true },
  })

  console.log('\n📊 Resumen del seed:')
  console.log(`   - Usuarios: ${totalUsers}`)
  console.log(`   - Proyectos: ${totalProjects}`)
  console.log(`   - Entradas de tiempo: ${totalTimeEntries}`)
  console.log(`   - Total horas registradas: ${totalHours._sum.hours}h`)
  console.log('\n✨ Seed completado exitosamente!\n')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
