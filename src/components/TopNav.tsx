"use client";

interface TopNavProps {
  onNavigate: (section: "dashboard" | "reports" | "plans") => void;
  activeSection: "dashboard" | "reports" | "plans";
}

export default function TopNav({ onNavigate, activeSection }: TopNavProps) {
  const items = [
    { id: "dashboard", label: "Actividades" },
    { id: "reports", label: "Reportes" },
    { id: "plans", label: "Plan de trabajo" }
  ] as const;

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <span className="text-sm font-semibold uppercase text-brand-slate">TimeSheet</span>
        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive
                    ? "bg-brand-blue text-white"
                    : "border border-slate-200 text-slate-600"
                }`}
                type="button"
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
