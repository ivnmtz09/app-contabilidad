# MisCuentaZ (Beta)

Una Progressive Web App (PWA) moderna e intuitiva diseñada para llevar el control absoluto de tus finanzas personales, construida con React y Tailwind CSS v4.

## Características Destacadas
* **Diseño Bento Grid:** Interfaz moderna, modular y completamente responsiva, con soporte nativo para Light/Dark Mode y efectos Glassmorphism.
* **Gestión Multicuenta:** Registro de ingresos y egresos distribuidos en múltiples billeteras (Bancolombia, Nequi, Nu, Davivienda, etc.) y efectivo.
* **Cálculo Automático de 4x1000:** Opción para aplicar y sumar automáticamente el impuesto transaccional colombiano en los egresos bancarios.
* **Análisis Visual (Recharts):** Gráficos interactivos de área para visualizar el historial de balances y estadísticas dinámicas por día, semana y mes.
* **Exportación Profesional (SheetJS):** Descarga de todos los movimientos generados directamente en un archivo `.xlsx` estructurado.
* **Seguridad y Persistencia:** Autenticación de usuarios mediante Google Auth (Firebase) y persistencia temporal de datos en localStorage.

## Instalación y Configuración Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/ivnmtz09/app-contabilidad.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Copia el archivo `.env.example` y renómbralo a `.env`.
   - Reemplaza los valores con las credenciales de tu propio proyecto de Firebase.
4. Ejecuta el servidor en tu red local:
   ```bash
   npm run dev
   ```
