# MisCuentaZ (v1.7.1)

Un centro de comando financiero personal diseñado para ser rápido, privado, seguro y estéticamente distinguido. Gestiona ingresos, egresos, transferencias, deudas, metas de ahorro, notas y suscripciones en tiempo real con una interfaz moderna basada en **Minimalist-Glassmorphism**, orbes de luz ambiental, personalización multitema y componentes vectoriales interactivos con física háptica.

**Demo en producción**: [app-contabilidad-ivnmtz.web.app](https://app-contabilidad-ivnmtz.web.app)

---

## Novedades de la Versión 1.7.1

### 1. Centrado Geométrico y Animación Realista de Extracción del Portatarjetas
- **Alineación Matemática Rigurosa**:
  - Contenedor de 250px con portatarjetas de 222px centrado (márgenes laterales exactos de 14px).
  - Tarjetas centradas mediante `translateX(-50%)`, eliminando rotaciones asimétricas que provocaban desfase visual a la derecha.
- **Hendidura de Ranura Interior (*Slot Aperture*)**:
  - Incorporación en el SVG de la ranura física de cuero con sombreado de profundidad interior (`#180602`), visualizando con fidelidad el orificio desde donde emerge la tarjeta.
- **Anclaje Físico al Eyectar**:
  - **En Reposo (`bottom: 8px`)**: La tarjeta reposa dentro de la ranura, con el saldo 100% oculto tras el bolsillo frontal de cuero.
  - **Extraída (`bottom: 62px`)**: La tarjeta se eleva en línea recta con física elástica de resorte (`cubic-bezier(0.34, 1.38, 0.64, 1)`), manteniendo su base inferior firmemente abrazada dentro del bolsillo frontal a la altura de la muesca ergonómica. Ya no flota en el aire; se aprecia con total claridad que la tarjeta reside dentro del portatarjetas.
  - **Jerarquía Visual del Saldo**: La sección `SALDO TOTAL` y la cifra se ubican en la zona media de la tarjeta, proyectándose por encima del borde del bolsillo con tipografía *Space Grotesk* de máximo contraste.

---

### 2. Categorías Prioritarias con Inferencia Semántica
El catálogo de egresos fue reorganizado para colocar en las primeras posiciones las categorías de mayor demanda:
1. **Comida** (`comida`): Icono `Utensils`, color naranja cálido.
2. **Compras** (`compras`): Icono `ShoppingBag`, color fucsia/magenta.
3. **Combustible** (`combustible`): Icono `Fuel`, color ámbar/dorado de estación de servicio.
4. **Farmacia** (`farmacia`): Icono `Pill`, color rojo/rosa salud.
5. **Ropa & Calzado** (`ropa`): Icono `Sparkles`, color púrpura moderno.
Seguidas de Mercado, Transporte, Servicios, Hogar, Salud, Ocio, Suscripciones, Educación, Viajes, Mascotas, Tecnología, Vehículo, Café, Impuestos, Deudas, Regalos y Donaciones.

- **Auto-detección Inteligente**:
  - *"Gasolina"*, *"Terpel"*, *"Texaco"*, *"Primax"*, *"Tanque"* $\rightarrow$ **Combustible**.
  - *"Farmatodo"*, *"Cruz Verde"*, *"Medicamentos"*, *"Dolex"* $\rightarrow$ **Farmacia**.
  - *"Zara"*, *"Zapatos"*, *"Camisa"*, *"Pantalón"* $\rightarrow$ **Ropa & Calzado**.
  - *"Restaurante"*, *"Almuerzo"*, *"Burger"* $\rightarrow$ **Comida**.

---

### 3. Prevención Dinámica de Cuentas Duplicadas
- **Filtrado Reactivo en `AddAccountModal`**:
  - La lista de entidades bancarias y métodos de pago (`COLOMBIAN_BANKS`) excluye automáticamente cualquier cuenta que el usuario ya tenga registrada (ej. Efectivo, Nequi, Bancolombia, Nu, etc.).
  - No es posible tener múltiples cuentas con el mismo nombre o entidad.
- **Protección a Nivel de Aplicación**:
  - Validación defensiva en `handleAddAccount` (`App.jsx`) con notificación `toast` para rechazar duplicados en caso de intento manual.
  - Si el usuario busca una entidad que ya posee, el modal despliega una alerta amigable informando que la cuenta ya existe.

---

## Novedades Anteriores (v1.6.0 & v1.7.0)

- **Seguridad en Firebase**: Reglas estrictas en Firestore (`auth.uid == userId`) con manejo resiliente ante cortes de conexión.
- **Motor Multitema**: 5 paletas completas configurables desde el Perfil (Violeta & Esmeralda, Océano & Lima, Atardecer Neón, Cyberpunk Índigo, Bosque Imperial & Oro).
- **Operaciones Atómicas**: Deducción de saldos con `increment()` de Firestore y transferencias atadas con `transferId` compartido.
- **Metas y Deudas**: Modal de abonos dedicado con cálculo visual de progreso en vivo.

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
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Compilar para producción:
   ```bash
   npm run build
   ```

---

*MisCuentaZ — Control patrimonial, diseño de autor y privacidad financiera.*
