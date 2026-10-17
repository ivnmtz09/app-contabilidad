import {
  Utensils,
  ShoppingBag,
  Fuel,
  Pill,
  Sparkles,
  ShoppingCart,
  Car,
  Zap,
  Home,
  HeartPulse,
  Film,
  Repeat,
  GraduationCap,
  Plane,
  PawPrint,
  Dumbbell,
  Laptop,
  Wrench,
  Coffee,
  Landmark,
  CreditCard,
  Gift,
  HeartHandshake,
  Tag,
  Briefcase,
  Store,
  TrendingUp,
  Building2,
  Award,
  ArrowDownLeft,
  RotateCcw,
  PiggyBank
} from "lucide-react";

/**
 * Categorías ampliadas para Gastos (Egresos)
 * Organizadas con máxima prioridad para las más frecuentes:
 * Comida, Compras, Combustible, Farmacia y Ropa & Calzado.
 */
export const EXPENSE_CATEGORIES = [
  { id: "comida", label: "Comida", icon: Utensils, colorClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/40" },
  { id: "compras", label: "Compras", icon: ShoppingBag, colorClass: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/40" },
  { id: "combustible", label: "Combustible", icon: Fuel, colorClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40" },
  { id: "farmacia", label: "Farmacia", icon: Pill, colorClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40" },
  { id: "ropa", label: "Ropa & Calzado", icon: Sparkles, colorClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40" },
  { id: "mercado", label: "Mercado", icon: ShoppingCart, colorClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" },
  { id: "transporte", label: "Transporte", icon: Car, colorClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
  { id: "servicios", label: "Servicios", icon: Zap, colorClass: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40" },
  { id: "vivienda", label: "Hogar", icon: Home, colorClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40" },
  { id: "salud", label: "Salud", icon: HeartPulse, colorClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40" },
  { id: "entretenimiento", label: "Ocio", icon: Film, colorClass: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/40" },
  { id: "suscripciones", label: "Suscripción", icon: Repeat, colorClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40" },
  { id: "educacion", label: "Educación", icon: GraduationCap, colorClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/40" },
  { id: "viajes", label: "Viajes", icon: Plane, colorClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/40" },
  { id: "mascotas", label: "Mascotas", icon: PawPrint, colorClass: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/40" },
  { id: "cuidado_personal", label: "Cuidado Personal", icon: Sparkles, colorClass: "bg-pink-600/15 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800/40" },
  { id: "deportes", label: "Deporte & Fit", icon: Dumbbell, colorClass: "bg-lime-500/15 text-lime-600 dark:text-lime-400 border-lime-200 dark:border-lime-800/40" },
  { id: "tecnologia", label: "Tecnología", icon: Laptop, colorClass: "bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800/40" },
  { id: "vehiculo", label: "Vehículo", icon: Wrench, colorClass: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/40" },
  { id: "cafe", label: "Café & Snacks", icon: Coffee, colorClass: "bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/40" },
  { id: "impuestos", label: "Impuestos", icon: Landmark, colorClass: "bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800/40" },
  { id: "deudas", label: "Deudas & Crédito", icon: CreditCard, colorClass: "bg-rose-600/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800/40" },
  { id: "regalos", label: "Regalos", icon: Gift, colorClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40" },
  { id: "donaciones", label: "Donaciones", icon: HeartHandshake, colorClass: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/40" },
  { id: "otros", label: "Otros", icon: Tag, colorClass: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700" }
];

/**
 * Categorías ampliadas para Ingresos
 */
export const INCOME_CATEGORIES = [
  { id: "salario", label: "Salario", icon: Briefcase, colorClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" },
  { id: "freelance", label: "Freelance", icon: Laptop, colorClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/40" },
  { id: "negocio", label: "Negocio & Ventas", icon: Store, colorClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
  { id: "inversiones", label: "Inversión", icon: TrendingUp, colorClass: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/40" },
  { id: "alquiler", label: "Rentas", icon: Building2, colorClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40" },
  { id: "bono", label: "Bono & Prima", icon: Award, colorClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40" },
  { id: "transferencia", label: "Transferencia", icon: ArrowDownLeft, colorClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/40" },
  { id: "reembolso", label: "Reembolso", icon: RotateCcw, colorClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40" },
  { id: "regalo", label: "Regalo", icon: Gift, colorClass: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/40" },
  { id: "otros_ingresos", label: "Otros", icon: PiggyBank, colorClass: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700" }
];

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

/**
 * Obtiene la metadata (etiqueta, icono y color) de una categoría.
 * Si no está definida en la transacción, deduce la categoría inteligentemente por la descripción.
 */
export function getCategoryMeta(txOrCategory, type = "egreso") {
  let categoryId = "";
  let description = "";
  let txType = type;

  if (typeof txOrCategory === "string") {
    categoryId = txOrCategory;
  } else if (txOrCategory && typeof txOrCategory === "object") {
    categoryId = txOrCategory.category || "";
    description = (txOrCategory.description || "").toLowerCase();
    txType = txOrCategory.type || type;
  }

  // 1. Coincidencia directa por ID
  if (categoryId) {
    const found = ALL_CATEGORIES.find(c => c.id === categoryId);
    if (found) return found;
  }

  // 2. Inferencia inteligente por descripción si no hay categoría guardada o al escribir
  if (description) {
    if (txType === "ingreso") {
      if (/sueldo|salario|nomina|quincena|pago quincenal|empleo/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "salario");
      }
      if (/freelance|honorario|trabajo independiente|proyecto freelance|desarrollo/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "freelance");
      }
      if (/venta|cliente|factura|tienda|producto|comercio|pedido/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "negocio");
      }
      if (/interes|dividendo|rendimiento|inversion|ganancia|acciones|crypto|staking/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "inversiones");
      }
      if (/arriendo recibido|alquiler recibido|renta|canon/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "alquiler");
      }
      if (/bono|prima|comision|aguinaldo|incentivo|premio laboral/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "bono");
      }
      if (/reembolso|devolucion|viatico|reintegro/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "reembolso");
      }
      if (/regalo|cumple|premio|obsequio/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "regalo");
      }
      if (/transferencia|consignacion|deposito/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "transferencia");
      }
    } else {
      // Prioridad 1: Combustible / Gasolina
      if (/gasolina|combustible|tanque|tanquear|terpel|texaco|primax|mobil|brio|biomax|estacion de servicio|acpm|diesel/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "combustible");
      }
      // Prioridad 2: Farmacia y Medicamentos
      if (/farmacia|drogueria|medicamento|pastilla|jarabe|receta|farmatodo|cruz verde|drogas la rebaja|dolex|advil|acetaminofen/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "farmacia");
      }
      // Prioridad 3: Ropa y Calzado
      if (/ropa|zapato|tenis|camisa|pantalon|chaqueta|zara|hm|stradivarius|bershka|vestido|calzado|falda|buzo|bermuda/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "ropa");
      }
      // Comida y Restaurantes
      if (/comida|almuerzo|cena|desayuno|restaurante|burger|pizza|sushi|hamburguesa|pollo|asado|panaderia|empanada|crepes|domicilio/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "comida");
      }
      // Compras generales
      if (/compras|tienda|compra|amazon|aliexpress|shein|mall|centro comercial|mercadolibre/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "compras");
      }
      // Supermercado
      if (/mercado|super|d1|exito|carulla|jumbo|olimpica|abarrotes|fruver/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "mercado");
      }
      // Mascotas
      if (/perro|gato|mascota|veterinari|vet|purina|whiskas|pedigree|pet|canino|felino/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "mascotas");
      }
      // Café y Snacks
      if (/starbucks|juan valdez|cafe|tostao|reposteria|croissant|snack|latte|capuchino/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "cafe");
      }
      // Cuidado Personal
      if (/barber|peluquer|corte|unas|salon|cosmetic|maquillaje|spa|skincare|perfume|estetica/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "cuidado_personal");
      }
      // Deporte y Fitness
      if (/gym|gimnasio|smartfit|crossfit|suplement|proteina|cancha|futbol|padel|fitness|pesas/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "deportes");
      }
      // Tecnología y Gadgets
      if (/apple|celular|computador|laptop|pantalla|teclado|audifonos|mouse|hardware|gadget|software|hosting/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "tecnologia");
      }
      // Vehículo y Mantenimiento
      if (/mecanic|taller|soat|lavado carro|llanta|repuesto|cambio de aceite|tecnomecanica/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "vehiculo");
      }
      // Transporte y Movilidad
      if (/uber|didi|cabify|taxi|gas|transmilenio|metro|pasaje|peaje|estacionamiento|parqueadero/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "transporte");
      }
      // Servicios Públicos
      if (/luz|agua|energia|gas domiciliario|internet|claro|tigo|movistar|etb|recibo|factura/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "servicios");
      }
      // Vivienda / Hogar
      if (/arriendo|alquiler|casa|apto|apartamento|administracion|mueble/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "vivienda");
      }
      // Salud y Medicina
      if (/medico|medicina|cita medica|hospital|salud|dientes|odontologo|optica|lentes/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "salud");
      }
      // Suscripciones y Streaming
      if (/netflix|spotify|hbo|max|disney|prime|youtube|apple tv|suscripcion|patreon/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "suscripciones");
      }
      // Educación
      if (/curso|udemy|platzi|universidad|colegio|libro|clase|matricula|pension escolar/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "educacion");
      }
      // Ocio y Entretenimiento
      if (/cine|pelicula|bar|fiesta|concierto|juego|salida|teatro|parque/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "entretenimiento");
      }
      // Viajes y Turismo
      if (/viaje|hotel|vuelo|avion|aeropuerto|vacaciones|airbnb|pasaporte/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "viajes");
      }
      // Impuestos y Tasas
      if (/dian|impuesto|predial|retencion|tasa|estampilla|ica|gravamen|4x1000/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "impuestos");
      }
      // Deudas y Créditos
      if (/credito|cuota|prestamo|hipoteca|interes bancario|deuda/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "deudas");
      }
      // Donaciones
      if (/donacion|iglesia|diezmo|fundacion|caridad|ofrenda/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "donaciones");
      }
      // Regalos
      if (/regalo|flores|cumpleanos|aniversario|detalle/.test(description)) {
        return ALL_CATEGORIES.find(c => c.id === "regalos");
      }
    }
  }

  // 3. Fallback por defecto según el tipo
  return txType === "ingreso"
    ? ALL_CATEGORIES.find(c => c.id === "otros_ingresos")
    : ALL_CATEGORIES.find(c => c.id === "otros");
}
