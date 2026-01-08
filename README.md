# TimeSheet Web (Next.js + Tailwind)

Guía rápida para **instalar, ejecutar y publicar** el proyecto, incluyendo un ejemplo con **Nginx**.

## Requisitos
- Node.js 18+ (recomendado LTS)
- npm 9+ (incluido con Node.js)

Verifica versiones:
```bash
node -v
npm -v
```

## Instalación de dependencias
```bash
npm install
```

> Si tu red bloquea npm (error 403), valida el proxy corporativo o usa un mirror permitido.

## Ejecutar en desarrollo
```bash
npm run dev
```

Abre: http://localhost:3000

## Ejecutar en producción (local)
1) Compila el proyecto:
```bash
npm run build
```

2) Arranca el servidor:
```bash
npm run start
```

Por defecto se expone en http://localhost:3000

## Variables de entorno
Para esta fase no hay variables obligatorias.  
Más adelante se usará `.env.local` para conexión a BD y autenticación.

## SQL Server: esquema inicial
El script con el esquema base está en:
```
sql/timesheet_schema.sql
```

Incluye tablas para usuarios, proyectos, paquetes, catálogo de actividades y actividades.

## Conexión a base de datos (SQL Server)
Cuando avances a la fase backend, la conexión típica en Next.js usa variables en `.env.local`:

```
DATABASE_URL="sqlserver://usuario:password@host:1433;database=TimeSheetDB;encrypt=true;trustServerCertificate=true"
```

Luego en el servidor (por ejemplo con Prisma) se lee `process.env.DATABASE_URL`.
> Esto es equivalente al `application.properties` en Spring Boot.

## Publicación con Nginx (reverse proxy)

### Opción A: Ejecutar Next.js en modo producción y Nginx como proxy
1) Construye y arranca Next.js:
```bash
npm run build
npm run start
```

2) Configura Nginx para proxear al puerto 3000:
```
server {
  listen 80;
  server_name tu-dominio.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

3) Recarga Nginx:
```bash
sudo nginx -s reload
```

### Opción B: Exportar estático (solo si no usas funciones server)
Esta opción **solo funciona** si el proyecto no requiere Server Components con datos dinámicos.
```bash
npm run build
npm run export
```
Luego sirve el contenido de `out/` con Nginx.

## Estructura principal
```
src/app/            # App Router (Next.js)
src/components/     # UI reusable
src/lib/            # Tipos y datos de ejemplo
```

## Scripts disponibles
- `npm run dev` → desarrollo
- `npm run build` → compilar
- `npm run start` → producción
- `npm run lint` → lint
