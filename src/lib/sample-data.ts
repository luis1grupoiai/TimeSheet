import type { Activity, CatalogActivity, Package, Project, User } from "@/lib/types";

// Usuario hardcodeado (equivalente a un usuario autenticado temporalmente).
export const hardcodedUser: User = {
  id: 101,
  nombre: "María López",
  supervisorId: 55
};

// Usuarios disponibles para reportes (en el futuro vendrán de autenticación).
export const users: User[] = [
  hardcodedUser,
  { id: 102, nombre: "Carlos Rivera", supervisorId: 55 },
  { id: 103, nombre: "Lucía Vega", supervisorId: 55 }
];

// Proyectos base para el formulario.
export const projects: Project[] = [
  { id: 1, nombre: "Proyecto Alpha" },
  { id: 2, nombre: "Proyecto Beta" },
  { id: 3, nombre: "Proyecto Gamma" }
];

// Paquetes disponibles por proyecto (algunos empleados pueden no tener paquete asignado).
export const packages: Package[] = [
  { id: 1, nombre: "PK-ALPHA-01", proyectoId: 1 },
  { id: 2, nombre: "PK-ALPHA-02", proyectoId: 1 },
  { id: 3, nombre: "PK-BETA-01", proyectoId: 2 }
];

// Catálogo de actividades por proyecto.
export const catalogActivities: CatalogActivity[] = [
  { id: 1, nombre: "Sesión", proyectoId: 1 },
  { id: 2, nombre: "Desarrollo", proyectoId: 1 },
  { id: 3, nombre: "Retrabajo", proyectoId: 2 },
  { id: 4, nombre: "Tiempo muerto", proyectoId: 2 },
  { id: 5, nombre: "QA", proyectoId: 3 }
];

// Actividades iniciales para demostrar el flujo sin BD.
export const initialActivities: Activity[] = [
  {
    id: 1,
    nombre: "Sesión",
    descripcion: "Entrevistas con usuarios clave",
    horas: 3,
    fecha: "2024-07-01",
    usuarioId: 101,
    proyectoId: 1,
    catalogoId: 1,
    paqueteId: 1
  },
  {
    id: 2,
    nombre: "Retrabajo",
    descripcion: "Diagrama entidad-relación inicial",
    horas: 4,
    fecha: "2024-07-02",
    usuarioId: 102,
    proyectoId: 2,
    catalogoId: 3,
    paqueteId: null
  },
  {
    id: 3,
    nombre: "QA",
    descripcion: "Pruebas de validación en sitio",
    horas: 2.5,
    fecha: "2024-07-03",
    usuarioId: 103,
    proyectoId: 3,
    catalogoId: 5,
    paqueteId: null
  }
];
