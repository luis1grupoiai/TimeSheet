import type { Metadata } from "next";
import "./globals.css";

// Metadata es como la configuración global del HTML (similar a etiquetas en un layout de Spring MVC).
export const metadata: Metadata = {
  title: "TimeSheet - Registro de Actividades",
  description: "Registro de actividades y horas trabajadas"
};

// RootLayout envuelve toda la aplicación (como un layout base en Spring Boot + Thymeleaf).
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
