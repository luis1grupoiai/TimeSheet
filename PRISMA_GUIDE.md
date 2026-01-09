# 📚 Guía de Prisma - TimeSheet

Esta guía te enseña cómo usar Prisma en tu proyecto TimeSheet.

## 📋 Tabla de Contenidos

1. [¿Qué es Prisma?](#qué-es-prisma)
2. [Comandos Principales](#comandos-principales)
3. [Estructura del Schema](#estructura-del-schema)
4. [Ejecutar Consultas](#ejecutar-consultas)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Migraciones](#migraciones)
7. [Prisma Studio](#prisma-studio)

---

## 🤔 ¿Qué es Prisma?

Prisma es un **ORM (Object-Relational Mapping)** moderno que te permite:

- ✅ Definir tu base de datos con un schema declarativo
- ✅ Generar tipos TypeScript automáticamente
- ✅ Escribir consultas type-safe (sin errores de tipos)
- ✅ Migrar tu base de datos fácilmente
- ✅ Tener autocompletado en tu editor

---

## 🚀 Comandos Principales

### Generar el Cliente de Prisma

Después de modificar el schema, debes generar el cliente:

```bash
npm run prisma:generate
```

### Crear una Migración

Cuando modificas el schema y quieres aplicar los cambios a la base de datos:

```bash
npm run prisma:migrate
```

Esto te pedirá un nombre para la migración, por ejemplo: `add_user_table`

### Abrir Prisma Studio

Prisma Studio es una interfaz visual para ver y editar tus datos:

```bash
npm run prisma:studio
```

Se abrirá en `http://localhost:5555`

### Resetear la Base de Datos

⚠️ **Cuidado**: Esto elimina todos los datos

```bash
npx prisma migrate reset
```

---

## 📐 Estructura del Schema

El schema está en `prisma/schema.prisma`. Tenemos 4 modelos principales:

### 1. User (Usuario)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      Role     @default(EMPLOYEE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Project (Proyecto)

```prisma
model Project {
  id          String        @id @default(uuid())
  name        String
  description String?
  status      ProjectStatus @default(ACTIVE)
}
```

### 3. ProjectMember (Miembro de Proyecto)

Relación muchos-a-muchos entre User y Project.

### 4. TimeEntry (Entrada de Tiempo)

```prisma
model TimeEntry {
  id          String   @id @default(uuid())
  userId      String
  projectId   String
  description String?
  hours       Float
  date        DateTime
}
```

---

## 💻 Ejecutar Consultas

### Importar Prisma

En cualquier archivo donde quieras usar Prisma:

```typescript
import { prisma } from '@/lib/prisma'
```

### Consultas Básicas

#### CREATE (Crear)

```typescript
// Crear un usuario
const user = await prisma.user.create({
  data: {
    email: 'usuario@ejemplo.com',
    name: 'Juan Pérez',
    role: 'EMPLOYEE',
  },
})
```

#### READ (Leer)

```typescript
// Obtener todos los usuarios
const users = await prisma.user.findMany()

// Obtener un usuario específico
const user = await prisma.user.findUnique({
  where: { email: 'usuario@ejemplo.com' },
})

// Obtener con filtros
const activeProjects = await prisma.project.findMany({
  where: { status: 'ACTIVE' },
})
```

#### UPDATE (Actualizar)

```typescript
// Actualizar un usuario
const updatedUser = await prisma.user.update({
  where: { id: 'user-id' },
  data: { name: 'Nuevo Nombre' },
})
```

#### DELETE (Eliminar)

```typescript
// Eliminar un usuario
const deletedUser = await prisma.user.delete({
  where: { id: 'user-id' },
})

// Eliminar múltiples registros
const result = await prisma.timeEntry.deleteMany({
  where: { userId: 'user-id' },
})
```

---

## 🎯 Ejemplos Prácticos

### 1. Crear un Proyecto con Miembros

```typescript
const project = await prisma.project.create({
  data: {
    name: 'Proyecto Web',
    description: 'Desarrollo de app',
    status: 'ACTIVE',
    members: {
      create: [
        {
          userId: 'user-123',
          role: 'manager',
        },
      ],
    },
  },
  include: {
    members: true,
  },
})
```

### 2. Registrar Tiempo Trabajado

```typescript
const timeEntry = await prisma.timeEntry.create({
  data: {
    userId: 'user-123',
    projectId: 'project-456',
    description: 'Desarrollo de feature',
    hours: 3.5,
    date: new Date(),
  },
})
```

### 3. Obtener Total de Horas por Proyecto

```typescript
const stats = await prisma.timeEntry.aggregate({
  where: { projectId: 'project-456' },
  _sum: {
    hours: true,
  },
  _count: {
    id: true,
  },
})

console.log(`Total horas: ${stats._sum.hours}`)
console.log(`Total entradas: ${stats._count.id}`)
```

### 4. Buscar con Relaciones

```typescript
const user = await prisma.user.findUnique({
  where: { id: 'user-123' },
  include: {
    timeEntries: {
      include: {
        project: true,
      },
      orderBy: { date: 'desc' },
      take: 5,
    },
  },
})
```

### 5. Filtrar por Fecha

```typescript
const entries = await prisma.timeEntry.findMany({
  where: {
    date: {
      gte: new Date('2024-01-01'), // Mayor o igual
      lte: new Date('2024-12-31'), // Menor o igual
    },
  },
})
```

### 6. Búsqueda con OR

```typescript
const results = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: 'gmail' } },
      { name: { contains: 'Juan' } },
    ],
  },
})
```

### 7. Transacciones

```typescript
const result = await prisma.$transaction(async (tx) => {
  const project = await tx.project.create({
    data: { name: 'Nuevo Proyecto' },
  })

  await tx.projectMember.create({
    data: {
      projectId: project.id,
      userId: 'user-123',
      role: 'manager',
    },
  })

  return project
})
```

---

## 🔄 Migraciones

### ¿Qué son las Migraciones?

Las migraciones son cambios en tu base de datos que se guardan como historial.

### Crear una Migración

1. Modifica `prisma/schema.prisma`
2. Ejecuta:

```bash
npm run prisma:migrate
```

3. Dale un nombre descriptivo: `add_status_field`

### Ver Migraciones

Las migraciones se guardan en `prisma/migrations/`

---

## 🎨 Prisma Studio

Prisma Studio es una interfaz visual para tu base de datos.

### Abrir Studio

```bash
npm run prisma:studio
```

### Funcionalidades

- ✅ Ver todos tus datos en tablas
- ✅ Crear, editar, eliminar registros
- ✅ Filtrar y buscar
- ✅ Ver relaciones entre tablas

---

## 📝 Tips y Mejores Prácticas

### 1. Siempre usa el cliente singleton

```typescript
// ✅ CORRECTO
import { prisma } from '@/lib/prisma'

// ❌ INCORRECTO
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### 2. Manejo de Errores

```typescript
try {
  const user = await prisma.user.create({
    data: { email, name },
  })
} catch (error) {
  if (error.code === 'P2002') {
    console.log('Email ya existe')
  }
}
```

### 3. Select solo lo necesario

```typescript
// ✅ Mejor rendimiento
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
  },
})

// ❌ Trae todos los campos
const users = await prisma.user.findMany()
```

### 4. Usa include para relaciones

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    timeEntries: true,
    projects: true,
  },
})
```

---

## 🔗 Recursos Útiles

- [Documentación Oficial de Prisma](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Examples](https://github.com/prisma/prisma-examples)

---

## 📂 Archivos Importantes

- `prisma/schema.prisma` - Definición del schema
- `lib/prisma.ts` - Cliente de Prisma singleton
- `lib/examples/queries.ts` - Ejemplos de consultas
- `.env` - Variables de entorno (DATABASE_URL)

---

## 🎓 Siguiente Pasos

1. ✅ Ejecuta `npm run prisma:migrate` para crear la base de datos
2. ✅ Abre `npm run prisma:studio` para ver la interfaz
3. ✅ Revisa `lib/examples/queries.ts` para ver ejemplos
4. ✅ Crea tu primera API en `app/api/`
5. ✅ Lee la documentación oficial para aprender más

¡Ahora estás listo para usar Prisma! 🚀
