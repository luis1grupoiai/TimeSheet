import type { Activity, CatalogActivity, Package, Project, User } from "@/lib/types";

// Props para la tabla de actividades.
interface ActivityListProps {
  activities: Activity[];
  projects: Project[];
  packages: Package[];
  users: User[];
  catalogActivities: CatalogActivity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: number) => void;
}

// Componente que muestra la lista (tabla) de actividades.
export default function ActivityList({
  activities,
  projects,
  packages,
  users,
  catalogActivities,
  onEdit,
  onDelete
}: ActivityListProps) {
  const projectMap = new Map(projects.map((project) => [project.id, project.nombre]));
  const packageMap = new Map(packages.map((pkg) => [pkg.id, pkg.nombre]));
  const userMap = new Map(users.map((user) => [user.id, user.nombre]));
  const catalogMap = new Map(
    catalogActivities.map((activity) => [activity.id, activity.nombre])
  );

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
        No hay actividades para mostrar. Agrega una nueva o ajusta los filtros.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase text-slate-400">
            <th className="px-3">Usuario</th>
            <th className="px-3">Tipo</th>
            <th className="px-3">Actividad</th>
            <th className="px-3">Proyecto</th>
            <th className="px-3">Paquete</th>
            <th className="px-3">Horas</th>
            <th className="px-3">Fecha</th>
            <th className="px-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="rounded-lg bg-slate-50">
              <td className="px-3 py-2 text-sm text-slate-600">
                {userMap.get(activity.usuarioId) ?? "Sin usuario"}
              </td>
              <td className="px-3 py-2 text-sm text-slate-600">
                {catalogMap.get(activity.catalogoId) ?? "Sin tipo"}
              </td>
              <td className="px-3 py-2">
                <p className="text-sm font-semibold text-slate-700">{activity.nombre}</p>
                <p className="text-xs text-slate-500">{activity.descripcion}</p>
              </td>
              <td className="px-3 py-2 text-sm text-slate-600">
                {projectMap.get(activity.proyectoId) ?? "Sin proyecto"}
              </td>
              <td className="px-3 py-2 text-sm text-slate-600">
                {activity.paqueteId ? packageMap.get(activity.paqueteId) ?? "Sin paquete" : "Sin paquete"}
              </td>
              <td className="px-3 py-2 text-sm text-slate-600">{activity.horas} h</td>
              <td className="px-3 py-2 text-sm text-slate-600">{activity.fecha}</td>
              <td className="px-3 py-2">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                    type="button"
                    onClick={() => onEdit(activity)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                    type="button"
                    onClick={() => onDelete(activity.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
