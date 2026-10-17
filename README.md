# MisCuentaZ (v1.7.0)

Un centro de comando financiero personal diseñado para ser rápido, privado, seguro y estéticamente distinguido. Gestiona ingresos, egresos, transferencias, deudas, metas de ahorro, notas y suscripciones en tiempo real con una interfaz moderna basada en **Minimalist-Glassmorphism**, orbes de luz ambiental, personalización multitema y componentes vectoriales interactivos con física háptica.

**Demo en producción**: [app-contabilidad-ivnmtz.web.app](https://app-contabilidad-ivnmtz.web.app)

---

## Novedades de la Versión 1.7.0

### 1. Portatarjetas Ejecutivo en Cuero (Stealth Cardholder)
- **Privacidad Total en Reposo (Modo Sigilo)**:
  - La tarjeta principal descansa ahora profundamente anclada dentro del portatarjetas de cuero curtido (*Saddle Leather*).
  - El bolsillo frontal opaco de corte ergonómico resguarda el saldo acumulado y la cifra privada, dejando a la vista únicamente el remate superior con la insignia *MISCUENTAZ*, el chip EMV dorado y la señal contactless.
  - El saldo permanece 100% oculto e invisible hasta que el usuario interactúa explícitamente con el portatarjetas.
- **Arquitectura Espacial por Capas SVG (Z-Index Físico)**:
  - **Capa 0 (`z-0`)**: Respaldo base de cuero artesanal (*Backplate*) con pespunte perimetral en hilo crema.
  - **Capa 1 (`z-1`)**: Tarjeta posterior *Titanium Black* en ángulo sutil.
  - **Capa 2 (`z-2`)**: Tarjeta secundaria *Emerald Fintech* escalonada.
  - **Capa 3 (`z-3`)**: Separador de cuero intermedio con bisel dorado.
  - **Capa 4 (`z-4`)**: Tarjeta Financiera Principal interactiva.
  - **Capa 10 (`z-10`)**: Bolsillo frontal con corte para pulgar, pespunte artesanal y grabado en relieve *MISCUENTAZ*.
- **Extracción con Física Elástica**:
  - Al pulsar o presionar el portatarjetas (con soporte táctil, clic o teclado `Enter` / `Espacio`), la tarjeta principal se eyecta suavemente hacia arriba mediante una curva de aceleración `cubic-bezier(0.34, 1.42, 0.64, 1)`.
  - El saldo total emerge de las sombras con tipografía de alto contraste (*Space Grotesk*), acompañado de un botón de alternancia rápida para enmascarar con asteriscos (`••••••`).

---

### 2. Suite Ampliada de Categorías Inteligentes
Se amplió y refinó significativamente el catálogo de categorías, elevando la granularidad financiera a estándares FinTech de primer nivel:

#### Categorías de Egresos (22 Categorías)
| Categoría | Identificador | Icono Lucide | Color Semántico |
| :--- | :--- | :--- | :--- |
| **Comida** | `comida` | `Utensils` | Naranja cálido |
| **Mercado** | `mercado` | `ShoppingCart` | Esmeralda |
| **Transporte** | `transporte` | `Car` | Azul cobalto |
| **Servicios** | `servicios` | `Zap` | Ámbar eléctrico |
| **Hogar** | `vivienda` | `Home` | Índigo |
| **Salud** | `salud` | `HeartPulse` | Rosa médico |
| **Compras** | `compras` | `ShoppingBag` | Magenta |
| **Ocio** | `entretenimiento` | `Film` | Púrpura |
| **Suscripción** | `suscripciones` | `Repeat` | Cian digital |
| **Educación** | `educacion` | `GraduationCap` | Violeta |
| **Viajes** | `viajes` | `Plane` | Azul cielo |
| **Mascotas** | `mascotas` | `PawPrint` | Verde azulado |
| **Cuidado Personal** | `cuidado_personal` | `Sparkles` | Fucsia cosmético |
| **Deporte & Fit** | `deportes` | `Dumbbell` | Lima neón |
| **Tecnología** | `tecnologia` | `Laptop` | Azul zafiro |
| **Vehículo** | `vehiculo` | `Wrench` | Pizarra |
| **Café & Snacks** | `cafe` | `Coffee` | Ámbar tostado |
| **Impuestos** | `impuestos` | `Landmark` | Piedra neutro |
| **Deudas & Crédito** | `deudas` | `CreditCard` | Rojo financiero |
| **Regalos** | `regalos` | `Gift` | Rosa pastel |
| **Donaciones** | `donaciones` | `HeartHandshake` | Verde bosque |
| **Otros Gastos** | `otros` | `Tag` | Zinc neutro |

#### Categorías de Ingresos (10 Categorías)
| Categoría | Identificador | Icono Lucide | Color Semántico |
| :--- | :--- | :--- | :--- |
| **Salario** | `salario` | `Briefcase` | Esmeralda financiero |
| **Freelance** | `freelance` | `Laptop` | Violeta digital |
| **Negocio & Ventas** | `negocio` | `Store` | Azul empresarial |
| **Inversión** | `inversiones` | `TrendingUp` | Verde azulado bursátil |
| **Rentas** | `alquiler` | `Building2` | Índigo inmobiliario |
| **Bono & Prima** | `bono` | `Award` | Dorado / Ámbar |
| **Transferencia** | `transferencia` | `ArrowDownLeft` | Celeste bancario |
| **Reembolso** | `reembolso` | `RotateCcw` | Cian |
| **Regalo** | `regalo` | `Gift` | Rosa festivo |
| **Otros Ingresos** | `otros_ingresos` | `PiggyBank` | Zinc |

#### Inferencia Semántica y Filtro en Vivo
- **Auto-detección Inteligente**: Al redactar la descripción del movimiento (ej. *"Starbucks"*, *"Veterinaria"*, *"SmartFit"*, *"D1"*, *"Gasolina"* o *"Factura cliente"*), el sistema predice y preselecciona automáticamente la categoría correspondiente en tiempo real.
- **Buscador Instantáneo**: Selector en modal con campo de filtrado en vivo para localizar cualquier categoría al instante con navegación fluida y badge indicador permanente.

---

## Novedades Anteriores (v1.6.0)

- **Seguridad en Firebase**: Reglas estrictas en Firestore (`auth.uid == userId`) con manejo resiliente ante cortes de conexión.
- **Motor Multitema**: 5 paletas completas configurables desde el Perfil (Violeta & Esmeralda, Océano & Lima, Atardecer Neón, Cyberpunk Índigo, Bosque Imperial & Oro).
- **Operaciones Atómicas**: Deducción de saldos con `increment()` de Firestore y transferencias atadas con `transferId` compartido.
- **Metas y Deudas**: Modal de abonos dedicado con cálculo visual de progreso en vivo.

---

## Características Principales

- **Gestión Diaria**: Registro de ingresos y egresos con selección de cuenta y aplicación opcional de gravamen 4x1000.
- **Transferencias entre Cuentas**: Movimientos directos con confirmación en dos pasos.
- **Gráficos Financieros**: Curva de balance acumulado interactiva renderizada con `Recharts`.
- **Gastos Recurrentes**: Control de suscripciones y recibos fijos con débito automático de saldo.
- **Metas de Ahorro**: Presupuestos por objetivo con porcentaje de avance y fondeo en tiempo real.
- **Gestión de Deudas**: Rastreo de deudores y acreedores con soporte para amortizaciones parciales.
- **Editor de Notas**: Cuaderno rápido enriquecido (`React Quill`) para apuntes y listas de compras.
- **Exportación a Excel**: Reportes ejecutivos tabulados en formato XLSX con formato de moneda profesional.
- **Accesibilidad y Guías de Diseño**: Cumplimiento WCAG, contrastes verificados, soporte para modo claro/oscuro y diseño responsivo móvil-first.

---

## Stack Tecnológico

- **Frontend**: React 19 + Vite 8
- **Estilos**: Tailwind CSS v4 + Minimalist Glassmorphism
- **Iconografía**: Lucide React
- **Base de Datos & Auth**: Firebase Authentication + Cloud Firestore
- **Internacionalización**: i18next + react-i18next (Español / Inglés)
- **Gráficos**: Recharts
- **Exportación**: xlsx-js-style
- **Linter**: Oxlint

---

## Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ivnmtz09/app-contabilidad.git
   cd app-contabilidad
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno `.env`:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
   ```
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Compilar para producción:
   ```bash
   npm run build
   ```

---

*MisCuentaZ — Control patrimonial, diseño de autor y privacidad financiera.*
