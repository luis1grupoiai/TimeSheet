import Dashboard from "@/components/Dashboard";

// Página principal del sistema (equivalente al endpoint raíz en Spring MVC).
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Dashboard />
    </main>
  );
}
