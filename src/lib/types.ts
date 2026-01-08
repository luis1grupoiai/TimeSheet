// Interface es el equivalente a un DTO en Java: define la forma de los datos.
export interface User {
  id: number;
  nombre: string;
  supervisorId: number | null;
}

// Project representa un proyecto disponible en el sistema.
export interface Project {
  id: number;
  nombre: string;
}

// Package representa un paquete opcional dentro de un proyecto.
export interface Package {
  id: number;
  nombre: string;
  proyectoId: number;
}

// CatalogActivity representa un tipo de actividad predefinido por proyecto.
export interface CatalogActivity {
  id: number;
  nombre: string;
  proyectoId: number;
}

// Activity representa una actividad registrada por el usuario.
export interface Activity {
  id: number;
  nombre: string;
  descripcion: string;
  horas: number;
  fecha: string; // ISO yyyy-mm-dd
  usuarioId: number;
  proyectoId: number;
  catalogoId: number;
  paqueteId?: number | null;
}
