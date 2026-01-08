"use client";

import { useMemo, useState } from "react";
import ActivityForm from "@/components/ActivityForm";
import ActivityList from "@/components/ActivityList";
import SummaryCards from "@/components/SummaryCards";
import { hardcodedUser, initialActivities, packages, projects } from "@/lib/sample-data";
import type { Activity } from "@/lib/types";

// Este componente es "client" porque usa estado (equivalente a un formulario interactivo en el navegador).
export default function Dashboard() {
  // Estado principal: actividades registradas por el usuario.
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  // Estado del formulario para crear o editar actividades.
  const [formState, setFormState] = useState({
    nombre: "",
    descripcion: "",
    horas: "",
    fecha: "",
    proyectoId: "",
    paqueteId: ""
  });
  // Si editingId tiene un valor, estamos editando una actividad existente.
  const [editingId, setEditingId] = useState<number | null>(null);
  // Filtro por proyecto (vacío significa "todos").
  const [filterProjectId, setFilterProjectId] = useState<string>("");
  // Filtro por fecha exacta (vacío significa "todas").
  const [filterDate, setFilterDate] = useState<string>("");

  // Lista filtrada según los controles del usuario.
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesProject = filterProjectId
        ? activity.proyectoId === Number(filterProjectId)
        : true;
      const matchesDate = filterDate ? activity.fecha === filterDate : true;
      return matchesProject && matchesDate;
    });
  }, [activities, filterProjectId, filterDate]);

  // Totales por día, semana y mes (base para reportes básicos).
  const summary = useMemo(() => {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(dayStart);
    weekStart.setDate(dayStart.getDate() - 6);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totals = {
      day: 0,
      week: 0,
      month: 0
    };

    activities.forEach((activity) => {
      const activityDate = new Date(activity.fecha + "T00:00:00");

      if (activityDate >= dayStart && activityDate <= now) {
        totals.day += activity.horas;
      }

      if (activityDate >= weekStart && activityDate <= now) {
        totals.week += activity.horas;
      }

      if (activityDate >= monthStart && activityDate <= now) {
        totals.month += activity.horas;
      }
    });

    return totals;
  }, [activities]);

  // Maneja cambios en los inputs del formulario.
  const handleFormChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      paqueteId: field === "proyectoId" ? "" : prev.paqueteId
    }));
  };

  // Guarda (crea o actualiza) una actividad.
  const handleSaveActivity = () => {
    if (!formState.nombre || !formState.horas || !formState.fecha || !formState.proyectoId) {
      alert("Completa nombre, horas, fecha y proyecto.");
      return;
    }

    if (editingId) {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === editingId
            ? {
                ...activity,
                nombre: formState.nombre,
                descripcion: formState.descripcion,
                horas: Number(formState.horas),
                fecha: formState.fecha,
                proyectoId: Number(formState.proyectoId),
                paqueteId: formState.paqueteId ? Number(formState.paqueteId) : null
              }
            : activity
        )
      );
    } else {
      const nextId = Math.max(0, ...activities.map((activity) => activity.id)) + 1;
      const newActivity: Activity = {
        id: nextId,
        nombre: formState.nombre,
        descripcion: formState.descripcion,
        horas: Number(formState.horas),
        fecha: formState.fecha,
        proyectoId: Number(formState.proyectoId),
        paqueteId: formState.paqueteId ? Number(formState.paqueteId) : null
      };

      setActivities((prev) => [newActivity, ...prev]);
    }

    setFormState({
      nombre: "",
      descripcion: "",
      horas: "",
      fecha: "",
      proyectoId: "",
      paqueteId: ""
    });
    setEditingId(null);
  };

  // Carga la actividad seleccionada dentro del formulario para editarla.
  const handleEditActivity = (activity: Activity) => {
    setFormState({
      nombre: activity.nombre,
      descripcion: activity.descripcion,
      horas: String(activity.horas),
      fecha: activity.fecha,
      proyectoId: String(activity.proyectoId),
      paqueteId: activity.paqueteId ? String(activity.paqueteId) : ""
    });
    setEditingId(activity.id);
  };

  // Elimina una actividad del estado local.
  const handleDeleteActivity = (activityId: number) => {
    const confirmed = confirm("¿Seguro que quieres eliminar esta actividad?");
    if (!confirmed) return;
    setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
  };

  // Cancela el modo edición y limpia el formulario.
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState({
      nombre: "",
      descripcion: "",
      horas: "",
      fecha: "",
      proyectoId: "",
      paqueteId: ""
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-slate-500">Bienvenido</p>
        <h1 className="mt-2 text-2xl font-semibold text-brand-slate">
          {hardcodedUser.nombre}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Supervisor ID: {hardcodedUser.supervisorId ?? "Sin supervisor"}
        </p>
      </header>

      <SummaryCards totals={summary} />

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <ActivityForm
          formState={formState}
          onChange={handleFormChange}
          onSave={handleSaveActivity}
          onCancel={handleCancelEdit}
          isEditing={Boolean(editingId)}
          projects={projects}
          packages={packages}
        />

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-brand-slate">Tus actividades</h2>
              <p className="text-sm text-slate-500">
                Filtra por proyecto o fecha para revisar registros específicos.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                Fecha
                <input
                  className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  type="date"
                  value={filterDate}
                  onChange={(event) => setFilterDate(event.target.value)}
                />
              </label>
            </div>
          </div>

          <ActivityList
            activities={filteredActivities}
            projects={projects}
            packages={packages}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />
        </div>
      </section>
    </div>
  );
}
