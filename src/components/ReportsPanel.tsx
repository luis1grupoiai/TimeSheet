"use client";

import { useMemo, useState } from "react";
import type { Activity, CatalogActivity, Project, User } from "@/lib/types";

interface ReportsPanelProps {
  activities: Activity[];
  users: User[];
  projects: Project[];
  catalogActivities: CatalogActivity[];
}

export default function ReportsPanel({
  activities,
  users,
  projects,
  catalogActivities
}: ReportsPanelProps) {
  const [filterProjectId, setFilterProjectId] = useState<string>("");
  const [filterUserId, setFilterUserId] = useState<string>("");

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesProject = filterProjectId
        ? activity.proyectoId === Number(filterProjectId)
        : true;
      const matchesUser = filterUserId
        ? activity.usuarioId === Number(filterUserId)
        : true;
      return matchesProject && matchesUser;
    });
  }, [activities, filterProjectId, filterUserId]);

  const projectTotals = useMemo(() => {
    const totals = new Map<number, number>();
    filteredActivities.forEach((activity) => {
      totals.set(
        activity.proyectoId,
        (totals.get(activity.proyectoId) ?? 0) + activity.horas
      );
    });
    return totals;
  }, [filteredActivities]);

  const userTotals = useMemo(() => {
    const totals = new Map<number, number>();
    filteredActivities.forEach((activity) => {
      totals.set(
        activity.usuarioId,
        (totals.get(activity.usuarioId) ?? 0) + activity.horas
      );
    });
    return totals;
  }, [filteredActivities]);

  const catalogMap = useMemo(() => {
    return new Map(catalogActivities.map((activity) => [activity.id, activity.nombre]));
  }, [catalogActivities]);

  const exportJson = () => {
    const payload = {
      filtros: {
        proyectoId: filterProjectId ? Number(filterProjectId) : null,
        usuarioId: filterUserId ? Number(filterUserId) : null
      },
      actividades: filteredActivities,
      totalesPorProyecto: Array.from(projectTotals.entries()).map(([id, horas]) => ({
        proyectoId: id,
        horas
      })),
      totalesPorUsuario: Array.from(userTotals.entries()).map(([id, horas]) => ({
        usuarioId: id,
        horas
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reporte-actividades.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-brand-slate">Reporte rápido</h2>
          <p className="text-sm text-slate-500">
            Visualiza actividades por proyecto y por usuario, con exportación JSON.
          </p>
        </div>
        <button
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          type="button"
          onClick={exportJson}
        >
          Exportar JSON
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase text-slate-500">
          Proyecto
          <select
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={filterProjectId}
            onChange={(event) => setFilterProjectId(event.target.value)}
          >
            <option value="">Todos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold uppercase text-slate-500">
          Usuario
          <select
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={filterUserId}
            onChange={(event) => setFilterUserId(event.target.value)}
          >
            <option value="">Todos</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-600">Actividades por proyecto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center justify-between">
                <span>{project.nombre}</span>
                <span className="font-semibold">
                  {(projectTotals.get(project.id) ?? 0).toFixed(1)} h
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-600">Actividades por usuario</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <span>{user.nombre}</span>
                <span className="font-semibold">
                  {(userTotals.get(user.id) ?? 0).toFixed(1)} h
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-100 p-4">
        <h3 className="text-sm font-semibold text-slate-600">Detalle filtrado</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {filteredActivities.map((activity) => (
            <li key={activity.id} className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span>
                {activity.fecha} · {catalogMap.get(activity.catalogoId) ?? "Tipo"} · {activity.nombre}
              </span>
              <span className="font-semibold">{activity.horas} h</span>
            </li>
          ))}
          {filteredActivities.length === 0 ? (
            <li className="text-sm text-slate-400">No hay actividades con estos filtros.</li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
