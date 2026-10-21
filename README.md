# MisCuentaZ

Plataforma de gestión financiera personal enfocada en velocidad, privacidad y diseño de interfaz de autor. Permite registrar y monitorear ingresos, egresos, transferencias, deudas, metas de ahorro, compromisos recurrentes y notas financieras en tiempo real.

Desarrollada con arquitectura reactiva, componentes vectoriales con física háptica y un sistema de diseño basado en Minimalist Glassmorphism.

**Demo en producción:** [app-contabilidad-ivnmtz.web.app](https://app-contabilidad-ivnmtz.web.app)

---

## Interfaz de Usuario

### Modo Escritorio

<p align="center">
  <img src="screenshots/desktop.png" alt="MisCuentaZ - Vista de Escritorio" width="100%">
</p>

### Modo Móvil

<p align="center">
  <img src="screenshots/mobile.png" alt="MisCuentaZ - Vista Móvil" width="360">
</p>

---

## Características Principales

### Portatarjetas Ejecutivo en Cuero
- Privacidad en reposo: el saldo total y los datos sensibles permanecen resguardados dentro del compartimento interior.
- Extracción elástica: al interactuar mediante clic, toque o teclado (`Enter` / `Espacio`), la tarjeta principal se eyecta verticalmente revelando el balance disponible.
- Control de visibilidad: alternancia rápida para enmascarar cifras confidenciales.

### Categorización Financiera Inteligente
- Catálogo optimizado con priorización en gastos frecuentes: Comida, Compras, Combustible, Farmacia y Ropa.
- Inferencia semántica contextual que clasifica automáticamente conceptos cotidianos en su categoría correspondiente.

### Prevención de Duplicados y Consistencia Patrimonial
- Validación defensiva a nivel de formulario y estado para evitar entidades bancarias o métodos de pago duplicados.
- Sincronización atómica de saldos y transacciones vinculadas para transferencias entre cuentas.

### Accesibilidad y Experiencia de Uso
- Cumplimiento de estándares de accesibilidad WCAG 2.2 AA con áreas táctiles mínimas de 44x44px.
- Navegación completa por teclado con soporte para tecla Escape en modales y retroalimentación de foco visible.
- Bloqueo preventivo de envíos dobles y deshabilitación contextual en formularios incompletos.

### Personalización y Motor de Temas
- Paletas de color adaptativas con persistencia local.
- Soporte nativo para modo claro y modo oscuro de alto contraste.

---

## Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router |
| **Estilos** | Tailwind CSS v4, Lucide Icons |
| **Backend & Auth** | Firebase Authentication, Cloud Firestore |
| **Visualización** | Recharts |
| **Internacionalización** | i18next, react-i18next |
| **Exportación** | xlsx-js-style |
| **Calidad y Pruebas** | Oxlint, Playwright |

---

## Instalación y Ejecución Local

### Prerrequisitos
- Node.js 20 o superior
- npm 10 o superior

### Pasos de Configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ivnmtz09/app-contabilidad.git
   cd app-contabilidad
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el entorno de desarrollo:
   ```bash
   npm run dev
   ```

4. Generar compilación de producción:
   ```bash
   npm run build
   ```

5. Previsualizar la compilación:
   ```bash
   npm run preview
   ```

---

## Licencia

Distribuido bajo licencia MIT. Desarrollado por [Ivan Martinez](https://www.instagram.com/ivjmm.0109/).
