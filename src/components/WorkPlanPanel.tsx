"use client";

import { useMemo, useState } from "react";
import type { Project, User, WorkPlan } from "@/lib/types";

interface WorkPlanPanelProps {
  workPlans: WorkPlan[];
  projects: Project[];
  supervisor: User;
  onSave: (plan: WorkPlan) => void;
}

export default function WorkPlanPanel({
  workPlans,
  projects,
  supervisor,
  onSave
}: WorkPlanPanelProps) {
  const [formState, setFormState] = useState({
    proyectoId: "",
    descripcion: "",
    horasEstimadas: "",
    fechaInicio: "",
    fechaFin: "",
    archivoNombre: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleChange("archivoNombre", file?.name ?? "");
  };

  const handleSubmit = () => {
    if (
      !formState.proyectoId ||
      !formState.descripcion ||
      !formState.horasEstimadas ||
      !formState.fechaInicio ||
      !formState.fechaFin
    ) {
      alert("Completa proyecto, descripción, horas y fechas.");
      return;
    }

    const newPlan: WorkPlan = {
      id: Math.max(0, ...workPlans.map((plan) => plan.id)) + 1,
      supervisorId: supervisor.id,
      proyectoId: Number(formState.proyectoId),
      descripcion: formState.descripcion,
      horasEstimadas: Number(formState.horasEstimadas),
      fechaInicio: formState.fechaInicio,
      fechaFin: formState.fechaFin,
      archivoNombre: formState.archivoNombre || null
    };

    onSave(newPlan);
    setFormState({
      proyectoId: "",
      descripcion: "",
      horasEstimadas: "",
      fechaInicio: "",
      fechaFin: "",
      archivoNombre: ""
    });
  };

  const projectMap = useMemo(
    () => new Map(projects.map((project) => [project.id, project.nombre])),
    [projects]
  );

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-brand-slate">Plan de trabajo del supervisor</h2>
        <p className="text-sm text-slate-500">
          Registra estimaciones para que el equipo compare con las horas reales.
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Proyecto
            <select
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              value={formState.proyectoId}
              onChange={(event) => handleChange("proyectoId", event.target.value)}
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
            Descripción
            <textarea
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              placeholder="Ej: Estimación de entregables y sesiones"
              value={formState.descripcion}
              onChange={(event) => handleChange("descripcion", event.target.value)}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Horas estimadas
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                type="number"
                min="0"
                step="0.5"
                value={formState.horasEstimadas}
                onChange={(event) => handleChange("horasEstimadas", event.target.value)}
              />
            </label>

            <label className="text-xs font-semibold uppercase text-slate-500">
              Archivo (mock)
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                type="file"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Fecha inicio
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                type="date"
                value={formState.fechaInicio}
                onChange={(event) => handleChange("fechaInicio", event.target.value)}
              />
            </label>

            <label className="text-xs font-semibold uppercase text-slate-500">
              Fecha fin
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                type="date"
                value={formState.fechaFin}
                onChange={(event) => handleChange("fechaFin", event.target.value)}
              />
            </label>
          </div>

          <button
            className="rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white"
            type="button"
            onClick={handleSubmit}
          >
            Guardar plan de trabajo
          </button>
        </div>

        <div className="rounded-xl border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-600">Planes registrados</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            {workPlans.map((plan) => (
              <li key={plan.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-semibold text-slate-700">
                  {projectMap.get(plan.proyectoId) ?? "Proyecto"}
                </p>
                <p className="text-xs text-slate-500">Supervisor ID: {plan.supervisorId}</p>
                <p className="mt-1 text-sm text-slate-600">{plan.descripcion}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {plan.fechaInicio} → {plan.fechaFin} · {plan.horasEstimadas} h
                </p>
                {plan.archivoNombre ? (
                  <p className="mt-1 text-xs text-slate-500">Archivo: {plan.archivoNombre}</p>
                ) : null}
              </li>
            ))}
            {workPlans.length === 0 ? (
              <li className="text-sm text-slate-400">Aún no hay planes registrados.</li>
            ) : null}
          </ul>
        </div>
      </div>
    </section>
  );
}
