import type { Package, Project } from "@/lib/types";

// Props del formulario: es como un DTO que llega desde el componente padre.
interface ActivityFormProps {
  formState: {
    nombre: string;
    descripcion: string;
    horas: string;
    fecha: string;
    proyectoId: string;
    paqueteId: string;
  };
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  projects: Project[];
  packages: Package[];
}

// Formulario para crear o editar actividades (equivalente a un formulario HTML tradicional).
export default function ActivityForm({
  formState,
  onChange,
  onSave,
  onCancel,
  isEditing,
  projects,
  packages
}: ActivityFormProps) {
  const selectedProjectId = Number(formState.proyectoId);
  const availablePackages = packages.filter(
    (pkg) => pkg.proyectoId === selectedProjectId
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-brand-slate">
          {isEditing ? "Editar actividad" : "Nueva actividad"}
        </h2>
        <p className="text-sm text-slate-500">
          Completa los datos básicos para registrar horas trabajadas.
        </p>
      </div>

      <label className="text-xs font-semibold uppercase text-slate-500">
        Nombre
        <input
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          type="text"
          placeholder="Ej: Revisión de planos"
          value={formState.nombre}
          onChange={(event) => onChange("nombre", event.target.value)}
        />
      </label>

      <label className="text-xs font-semibold uppercase text-slate-500">
        Descripción
        <textarea
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          rows={3}
          placeholder="Detalles de la actividad"
          value={formState.descripcion}
          onChange={(event) => onChange("descripcion", event.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase text-slate-500">
          Horas
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            type="number"
            min="0"
            step="0.5"
            placeholder="Ej: 4"
            value={formState.horas}
            onChange={(event) => onChange("horas", event.target.value)}
          />
        </label>

        <label className="text-xs font-semibold uppercase text-slate-500">
          Fecha
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            type="date"
            value={formState.fecha}
            onChange={(event) => onChange("fecha", event.target.value)}
          />
        </label>
      </div>

      <label className="text-xs font-semibold uppercase text-slate-500">
        Proyecto
        <select
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={formState.proyectoId}
          onChange={(event) => onChange("proyectoId", event.target.value)}
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs font-semibold uppercase text-slate-500">
        Paquete (opcional)
        <select
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={formState.paqueteId}
          onChange={(event) => onChange("paqueteId", event.target.value)}
          disabled={!formState.proyectoId}
        >
          <option value="">Sin paquete</option>
          {availablePackages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.nombre}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
          type="button"
          onClick={onSave}
        >
          {isEditing ? "Guardar cambios" : "Registrar actividad"}
        </button>

        {isEditing ? (
          <button
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            type="button"
            onClick={onCancel}
          >
            Cancelar edición
          </button>
        ) : null}
      </div>
    </div>
  );
}
