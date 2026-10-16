# MisCuentaZ (v1.6.0)

Un centro de comando financiero personal diseñado para ser rápido, seguro, estéticamente impecable y altamente responsivo. Gestiona tus ingresos, egresos, transferencias, deudas, metas de ahorro, notas y suscripciones — todo en tiempo real con una interfaz moderna basada en **Minimalist-Glassmorphism**, orbes de luz ambiental y personalización multitema.

**Demo en producción**: [app-contabilidad-ivnmtz.web.app](https://app-contabilidad-ivnmtz.web.app)

---

## Novedades de la Versión 1.6.0

- **Reactivación y Seguridad de Firebase**:
  - Incorporación de `firestore.rules` con permisos estrictos por usuario autenticado (`auth.uid == userId`).
  - Listeners de Firestore con manejo resiliente de errores para evitar bloqueos de pantalla (`permission-denied`).
  - Autenticación Google reforzada ante políticas `Cross-Origin-Opener-Policy` (COOP) y popups bloqueados.
- **Rediseño Minimalist-Glassmorphism**:
  - Paleta insignia con **Moradito** (`#8b5cf6`) como primario y **Verdecito** (`#10b981`) como secundario.
  - Tarjetas translúcidas con `backdrop-blur-2xl`, bordes semi-transparentes y orbes de luz ambiental.
- **Billetera de Cuero Interactiva SVG**:
  - Componente vectorial interactivo `LeatherWallet` en el Home, mostrando una billetera de cuero marrón que al tocarse despliega una tarjeta animada con el saldo del usuario.
- **Motor de Personalización con 5 Temas**:
  - Selector visual interactivo en la página de Perfil con 5 paletas completas:
    1. **Violeta & Esmeralda** *(Original Moradito y Verdecito)*
    2. **Océano & Lima** *(Azul eléctrico y Lima neón)*
    3. **Atardecer Neón** *(Magenta fucsia y Ámbar cálido)*
    4. **Cyberpunk Índigo & Menta** *(Índigo profundo y Menta fresca)*
    5. **Bosque Imperial & Oro** *(Verde jade y Dorado clásico)*
  - Compatible al 100% tanto con **Modo Claro** como con **Modo Oscuro** y persistencia en `localStorage`.
- **Mejoras Lógicas y Operaciones Atómicas**:
  - Deducción automática y atómica del saldo al registrar pagos de gastos recurrentes.
  - Sincronización de saldos con `increment()` de Firestore para evitar condiciones de carrera.
  - Vinculación de transferencias mediante `transferId` compartido para anulación/eliminación coordinada.
  - Nuevo modal `AddGoalFundsModal` para abonar a metas con vista previa de progreso en tiempo real y selección de cuenta.
  - Edición de nombre y eliminación segura de cuentas vacías en `AccountsCard`.
- **Responsividad Multidispositivo**:
  - Margen inferior optimizado (`pb-32`) para evitar solapamiento con la barra de navegación flotante (`BottomNav`).
  - Visualización adaptativa fluida desde 320px hasta pantallas ultra-wide.

---

## Características Principales

- **Gestión Diaria**: Registro ágil de ingresos y egresos con selección de cuenta y aplicación opcional de 4x1000.
- **Transferencias entre Cuentas**: Mueve dinero entre tus cuentas (Nequi, Bancolombia, Daviplata, Efectivo, etc.) con confirmación modal.
- **Gráficos Interactivos**: Visualización de balance acumulado en tiempo real con `Recharts`.
- **Gastos Recurrentes**: Control de suscripciones y recibos fijos con fecha de cobro y deducción de saldo inmediata.
- **Metas de Ahorro**: Define objetivos, calcula porcentajes de avance y abona fondos desde cuentas reales o virtuales.
- **Gestión de Deudas**: Registra a quién le debes y quién te debe dinero, con opciones de abono y cancelación.
- **Notas Rápidas**: Editor de texto enriquecido integrado (`React Quill`) para presupuestos, notas o listas.
- **Exportación a Excel**: Generación de reportes detallados en formato XLSX con diseño y estilos financieros.
- **Multilenguaje (i18n)**: Soporte completo e instantáneo para Español e Inglés.
- **Modales Seguros**: Acciones destructivas protegidas con `ConfirmModal` estilizado.

---

## Stack Tecnológico

- **Frontend**: React 19 + Vite 8
- **Estilos**: Tailwind CSS v4 + Glassmorphism personalizado
- **Iconografía**: Lucide React
- **Base de Datos & Auth**: Firebase Authentication + Cloud Firestore
- **Internacionalización**: i18next + react-i18next
- **Gráficos**: Recharts
- **Exportación**: xlsx-js-style
- **Linter**: Oxlint

---

## Instalación y Desarrollo

1. Clona este repositorio:
   ```bash
   git clone https://github.com/ivnmtz09/app-contabilidad.git
   cd app-contabilidad
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de Firebase en un archivo `.env` basado en:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
   ```
4. Aplica las reglas de seguridad en Firebase Console copiando el contenido de `firestore.rules`.
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
6. Compila para producción:
   ```bash
   npm run build
   ```

---
*MisCuentaZ — Control total, diseño minimalista y seguridad para tus finanzas.*
