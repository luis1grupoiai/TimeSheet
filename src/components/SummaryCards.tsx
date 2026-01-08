// Props para mostrar totales por periodo.
interface SummaryCardsProps {
  totals: {
    day: number;
    week: number;
    month: number;
  };
}

// Tarjetas de resumen (serán la base de los reportes posteriores).
export default function SummaryCards({ totals }: SummaryCardsProps) {
  const items = [
    { label: "Hoy", value: totals.day },
    { label: "Últimos 7 días", value: totals.week },
    { label: "Mes actual", value: totals.month }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-brand-slate">
            {item.value.toFixed(1)} h
          </p>
          <p className="text-sm text-slate-500">Horas registradas</p>
        </div>
      ))}
    </section>
  );
}
