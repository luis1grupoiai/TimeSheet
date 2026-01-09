import type { Activity, Package, Project, User } from "@/lib/types";

// Usuario hardcodeado (equivalente a un usuario autenticado temporalmente).
export const hardcodedUser: User = {
  id: 101,
  nombre: "María López",
  supervisorId: 55
};

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

// Actividades iniciales para demostrar el flujo sin BD.
export const initialActivities: Activity[] = [
  {
    id: 1,
    nombre: "Levantamiento de requerimientos",
    descripcion: "Entrevistas con usuarios clave",
    horas: 3,
    fecha: "2024-07-01",
    proyectoId: 1,
    usuarioId:1,
    catalogoId:1,
    paqueteId: 1
  },
  {
    id: 2,
    nombre: "Diseño de modelo",
    descripcion: "Diagrama entidad-relación inicial",
    horas: 4,
    fecha: "2024-07-02",
    proyectoId: 2,
    usuarioId:1,
    catalogoId:1,
    paqueteId: null
  }
];
