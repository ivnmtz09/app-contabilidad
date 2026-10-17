import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../utils/format';

/**
 * LeatherWallet — Portatarjetas ejecutivo artesanal (Luxury Leather Cardholder).
 *
 * Características de diseño:
 * 1. Centrado Geométrico Riguroso:
 *    - Ancho del contenedor: 250px.
 *    - Cuerpo del portatarjetas: 222px (márgenes exactos de 14px a cada lado).
 *    - Tarjeta principal: 208px con `translateX(-50%)` (márgenes interiores exactos de 7px a cada lado).
 * 2. Ranura Físicamente Integrada (Slot Aperture):
 *    - La tarjeta emerge directamente desde la hendidura interior del cuero.
 * 3. Anclaje y Física de Extracción:
 *    - En reposo: la tarjeta descansa a `bottom: 8px`, con el saldo 100% cubierto tras el bolsillo frontal.
 *    - Al presionar: la tarjeta se eleva verticalmente a `bottom: 62px`, manteniendo su base inferior
 *      abrazada dentro del bolsillo frontal de cuero (a la altura de la muesca ergonómica),
 *      proyectando el saldo total en la parte media-alta con alta jerarquía y contraste impecable.
 */
export default function LeatherWallet({ totalBalance, userName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none w-full max-w-[270px]">
      {/* ── ESCENA DEL PORTATARJETAS ─────────────────────────── */}
      <div
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Guardar tarjeta en el portatarjetas' : 'Extraer tarjeta del portatarjetas para ver saldo'}
        onKeyDown={handleKeyDown}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 transition-all duration-300"
        style={{
          width: 250,
          height: 230,
          perspective: 1000,
        }}
      >
        {/* Contenedor 3D con microinteracción al hover */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: isHovered && !isOpen
              ? 'translateY(-3px) scale(1.015)'
              : isOpen
              ? 'translateY(-2px)'
              : 'translateY(0)',
          }}
        >
          {/* ── CAPA 0: RESPALDO DE CUERO ARTESANAL (Base Posterior) ── */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ zIndex: 0 }}>
            <svg
              viewBox="0 0 250 170"
              width="250"
              height="170"
              className="w-full h-auto overflow-visible"
              role="presentation"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Cuero marrón curtido de lujo (Saddle Leather) */}
                <linearGradient id="holderLeatherBack" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9a3412" />
                  <stop offset="35%" stopColor="#7c2d12" />
                  <stop offset="70%" stopColor="#591c0b" />
                  <stop offset="100%" stopColor="#3b0f05" />
                </linearGradient>

                {/* Textura de grano fino de cuero */}
                <pattern id="cardholderTextureBack" width="4" height="4" patternUnits="userSpaceOnUse">
                  <rect width="4" height="4" fill="none" />
                  <line x1="0" y1="2" x2="4" y2="2" stroke="#250903" strokeWidth="0.35" strokeOpacity="0.35" />
                  <line x1="2" y1="0" x2="2" y2="4" stroke="#250903" strokeWidth="0.35" strokeOpacity="0.25" />
                </pattern>
              </defs>

              {/* Placa trasera de cuero */}
              <rect
                x="14" y="20" width="222" height="142" rx="18"
                fill="url(#holderLeatherBack)"
              />
              <rect x="14" y="20" width="222" height="142" rx="18" fill="url(#cardholderTextureBack)" />

              {/* Pespunte posterior perimetral */}
              <rect
                x="20" y="26" width="210" height="130" rx="14"
                fill="none" stroke="#fed7aa" strokeWidth="1.1" strokeDasharray="4 3" strokeOpacity="0.6"
              />

              {/* Hendidura de ranura interior (profundidad de entrada) */}
              <rect x="22" y="38" width="206" height="4" rx="2" fill="#180602" opacity="0.85" />
            </svg>
          </div>

          {/* ── CAPA 1: TARJETA SECUNDARIA POSTERIOR 1 (Titanium Black) ── */}
          <div
            className="absolute left-1/2 rounded-xl border border-zinc-700/60 shadow-sm transition-all duration-500 ease-out"
            style={{
              width: 196,
              height: 112,
              bottom: isOpen ? '84px' : '44px',
              zIndex: 1,
              background: 'linear-gradient(135deg, #18181b 0%, #27272a 60%, #09090b 100%)',
              transform: isOpen
                ? 'translateX(-50%) translateY(-4px) scale(0.97)'
                : 'translateX(-50%) translateY(0)',
              opacity: 0.95,
            }}
          >
            <div className="flex justify-between items-center px-4 pt-2.5">
              <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-400">TITANIUM</span>
              <div className="w-5 h-3 rounded-xs bg-amber-400/40 border border-amber-300/30" />
            </div>
          </div>

          {/* ── CAPA 2: TARJETA SECUNDARIA POSTERIOR 2 (Emerald Fintech) ── */}
          <div
            className="absolute left-1/2 rounded-xl border border-emerald-500/30 shadow-sm transition-all duration-500 ease-out"
            style={{
              width: 202,
              height: 114,
              bottom: isOpen ? '96px' : '32px',
              zIndex: 2,
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)',
              transform: isOpen
                ? 'translateX(-50%) translateY(-2px) scale(0.985)'
                : 'translateX(-50%) translateY(0)',
              opacity: 0.95,
            }}
          >
            <div className="flex justify-between items-center px-4 pt-2.5">
              <span className="text-[8px] font-display font-bold tracking-wider text-emerald-200">PREMIUM</span>
              <span className="text-[9px] font-bold text-white/90">VISA</span>
            </div>
          </div>

          {/* ── CAPA 3: SEPARADOR DE RANURA INTERMEDIA ── */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ zIndex: 3 }}>
            <svg
              viewBox="0 0 250 170"
              width="250"
              height="170"
              className="w-full h-auto overflow-visible"
              role="presentation"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="holderLeatherTierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="50%" stopColor="#67240c" />
                  <stop offset="100%" stopColor="#3d1308" />
                </linearGradient>
              </defs>

              {/* Lengüeta divisoria intermedia */}
              <path
                d="M 14 62
                   L 95 62
                   C 105 62, 115 67, 125 67
                   C 135 67, 145 62, 155 62
                   L 236 62
                   L 236 150
                   C 236 156, 230 162, 222 162
                   L 28 162
                   C 20 162, 14 156, 14 150
                   Z"
                fill="url(#holderLeatherTierGrad)"
              />
              {/* Bisel superior del nivel medio */}
              <line x1="14" y1="62" x2="236" y2="62" stroke="#fcd34d" strokeWidth="0.8" strokeOpacity="0.3" />
              <line x1="14" y1="63" x2="236" y2="63" stroke="#250903" strokeWidth="1.5" />

              {/* Hendidura donde entra la tarjeta principal */}
              <rect x="20" y="65" width="210" height="4" rx="2" fill="#180602" opacity="0.9" />
            </svg>
          </div>

          {/* ── CAPA 4: TARJETA PRINCIPAL INTERACTIVA (Saldo Total) ── */}
          {/*
            Centrado estricto: left: 50%, transform: translateX(-50%).
            En reposo (bottom: 8px): el saldo queda sumergido en el bolsillo frontal.
            Extraída (bottom: 62px): la base queda abrazada en la muesca del bolsillo frontal,
            evitando que la tarjeta quede flotando en el aire.
          */}
          <div
            className="absolute left-1/2 wallet-card transition-all"
            style={{
              bottom: isOpen ? '62px' : '8px',
              transition: 'bottom 0.52s cubic-bezier(0.34, 1.38, 0.64, 1)',
              transform: 'translateX(-50%)',
              width: 208,
              zIndex: 4,
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
          >
            <CreditCard
              balance={totalBalance}
              visible={isBalanceVisible}
              userName={userName}
              isOpen={isOpen}
            />
          </div>

          {/* ── CAPA 10: BOLSILLO FRONTAL DE CUERO (Abraza la Tarjeta y Cubre el Saldo en Reposo) ── */}
          <div
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            style={{
              zIndex: 10,
              filter: 'drop-shadow(0 14px 28px rgba(35, 15, 5, 0.42))',
            }}
          >
            <svg
              viewBox="0 0 250 170"
              width="250"
              height="170"
              className="w-full h-auto overflow-visible"
              role="presentation"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Cuero frontal con degradado rico */}
                <linearGradient id="holderLeatherFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#854d0e" />
                  <stop offset="25%" stopColor="#9a3412" />
                  <stop offset="65%" stopColor="#7c2d12" />
                  <stop offset="100%" stopColor="#431407" />
                </linearGradient>

                {/* Brillo satinado diagonal */}
                <linearGradient id="leatherGleamFront" x1="0%" y1="0%" x2="70%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
                  <stop offset="35%" stopColor="#ffffff" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                {/* Textura de grano para el bolsillo frontal */}
                <pattern id="cardholderTextureFront" width="4" height="4" patternUnits="userSpaceOnUse">
                  <rect width="4" height="4" fill="none" />
                  <line x1="0" y1="2" x2="4" y2="2" stroke="#250903" strokeWidth="0.35" strokeOpacity="0.3" />
                  <line x1="2" y1="0" x2="2" y2="4" stroke="#250903" strokeWidth="0.35" strokeOpacity="0.2" />
                </pattern>
              </defs>

              {/* Cuerpo del bolsillo frontal con corte ergonómico centrado (x=80 a 170, centro 125) */}
              <path
                d="M 14 90
                   L 80 90
                   C 95 90, 102 104, 125 104
                   C 148 104, 155 90, 170 90
                   L 236 90
                   L 236 148
                   C 236 156, 230 162, 222 162
                   L 28 162
                   C 20 162, 14 156, 14 148
                   Z"
                fill="url(#holderLeatherFrontGrad)"
              />
              <path
                d="M 14 90 L 80 90 C 95 90, 102 104, 125 104 C 148 104, 155 90, 170 90 L 236 90 L 236 148 C 236 156, 230 162, 222 162 L 28 162 C 20 162, 14 156, 14 148 Z"
                fill="url(#cardholderTextureFront)"
              />

              {/* Bisel superior del corte frontal con sombra interior */}
              <path
                d="M 14 90 L 80 90 C 95 90, 102 104, 125 104 C 148 104, 155 90, 170 90 L 236 90"
                fill="none" stroke="#fed7aa" strokeWidth="0.8" strokeOpacity="0.45"
              />
              <path
                d="M 14 91.5 L 80 91.5 C 95 91.5, 102 105.5, 125 105.5 C 148 105.5, 155 91.5, 170 91.5 L 236 91.5"
                fill="none" stroke="#250903" strokeWidth="1.8"
              />

              {/* Pespunte artesanal del bolsillo frontal */}
              <path
                d="M 22 98
                   L 78 98
                   C 92 98, 100 110, 125 110
                   C 150 110, 158 98, 172 98
                   L 228 98
                   L 228 146
                   C 228 152, 222 156, 216 156
                   L 34 156
                   C 28 156, 22 152, 22 146
                   Z"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="1.15"
                strokeDasharray="4 3"
                strokeOpacity="0.85"
              />

              {/* Repujado / Marca artesanal "MISCUENTAZ" en cuero */}
              <g opacity="0.88">
                <text
                  x="125" y="140"
                  fill="#fed7aa"
                  fontSize="9.5"
                  fontWeight="800"
                  fontFamily="Space Grotesk, sans-serif"
                  letterSpacing="2.5"
                  textAnchor="middle"
                >
                  MISCUENTAZ
                </text>
                <line x1="95" y1="147" x2="155" y2="147" stroke="#fed7aa" strokeWidth="0.8" strokeOpacity="0.5" />
              </g>

              {/* Capa de brillo superior de acabado */}
              <path
                d="M 14 90 L 80 90 C 95 90, 102 104, 125 104 C 148 104, 155 90, 170 90 L 236 90 L 236 148 C 236 156, 230 162, 222 162 L 28 162 C 20 162, 14 156, 14 148 Z"
                fill="url(#leatherGleamFront)"
              />
            </svg>
          </div>
        </div>

        {/* ── INDICADOR DE ACCIÓN PULSANTE ── */}
        {!isOpen && (
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
            style={{
              animation: 'walletPulse 2.2s ease-in-out infinite',
              opacity: isHovered ? 0 : 0.85,
              transition: 'opacity 0.2s',
            }}
          >
            <div className="w-10 h-[3.5px] bg-amber-500/80 dark:bg-amber-400/80 rounded-full shadow-xs" />
          </div>
        )}
      </div>

      {/* ── TEXTO GUÍA CON CONTRASTE ADAPTATIVO ── */}
      <p className="text-xs font-semibold text-amber-900/90 dark:text-amber-200/90 tracking-normal transition-colors text-center">
        {isOpen ? 'Toca para guardar la tarjeta' : 'Toca el portatarjetas para ver saldo'}
      </p>

      {/* ── BOTÓN TOGGLE SALDO (Solo activo al extraer la tarjeta) ── */}
      {isOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsBalanceVisible(v => !v);
          }}
          aria-label={isBalanceVisible ? 'Ocultar saldo de la tarjeta' : 'Mostrar saldo de la tarjeta'}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200/90 active:bg-amber-300 text-amber-950 border border-amber-300/80 dark:bg-white/10 dark:hover:bg-white/20 dark:text-zinc-100 dark:border-white/15 text-xs font-medium transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-xs"
        >
          {isBalanceVisible ? <EyeOff size={14} className="text-amber-700 dark:text-amber-300" /> : <Eye size={14} className="text-amber-700 dark:text-amber-300" />}
          <span>{isBalanceVisible ? 'Ocultar monto' : 'Mostrar monto'}</span>
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TARJETA FINANCIERA SVG — CENTRADA CON ALTA JERARQUÍA
   ───────────────────────────────────────────────────────── */
function CreditCard({ balance, visible, userName, isOpen }) {
  return (
    <svg
      viewBox="0 0 208 124"
      width="208"
      height="124"
      role="img"
      aria-label="Tarjeta financiera con saldo"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: isOpen
          ? 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.42))'
          : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25))',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <defs>
        {/* Gradiente reactivo al sistema de color del tema */}
        <linearGradient id="cardHolderPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary, #8b5cf6)" />
          <stop offset="55%" stopColor="var(--color-primary-hover, #6d28d9)" />
          <stop offset="100%" stopColor="var(--color-secondary, #10b981)" />
        </linearGradient>

        {/* Degradado protector de contraste */}
        <linearGradient id="cardContrastProtection" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#090d16" stopOpacity="0.05" />
          <stop offset="45%" stopColor="#090d16" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#090d16" stopOpacity="0.8" />
        </linearGradient>

        {/* Brillo superior */}
        <linearGradient id="cardSheen" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Chip EMV dorado */}
        <linearGradient id="chipGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Fondo con el gradiente del tema */}
      <rect width="208" height="124" rx="14" fill="url(#cardHolderPrimaryGrad)" />

      {/* Degradado protector de contraste para garantizar legibilidad */}
      <rect width="208" height="124" rx="14" fill="url(#cardContrastProtection)" />

      {/* Formas geométricas sutiles de fondo */}
      <circle cx="170" cy="-10" r="75" fill="rgba(255,255,255,0.08)" />
      <circle cx="180" cy="95" r="55" fill="rgba(255,255,255,0.06)" />
      <circle cx="-10" cy="85" r="50" fill="rgba(255,255,255,0.06)" />

      {/* Capa de brillo superior */}
      <rect width="208" height="124" rx="14" fill="url(#cardSheen)" />

      {/* ── PARTE SUPERIOR (Visible cuando la tarjeta reposa dentro de la ranura) ── */}
      {/* Nombre de la aplicación / Logo de la tarjeta */}
      <text
        x="18" y="20"
        fill="#ffffff"
        fontSize="10"
        fontWeight="800"
        fontFamily="Space Grotesk, sans-serif"
        letterSpacing="1.5"
        opacity="0.95"
      >
        MISCUENTAZ
      </text>

      {/* Círculos de franquicia estilo Visa/Mastercard */}
      <circle cx="178" cy="22" r="9" fill="rgba(255,255,255,0.28)" />
      <circle cx="189" cy="22" r="9" fill="rgba(255,255,255,0.18)" />

      {/* Chip EMV y señal Contactless */}
      <rect x="18" y="27" width="28" height="19" rx="4" fill="url(#chipGoldGrad)" stroke="#92400e" strokeWidth="0.7" />
      <line x1="18" y1="36.5" x2="46" y2="36.5" stroke="#78350f" strokeWidth="0.5" />
      <line x1="32" y1="27" x2="32" y2="46" stroke="#78350f" strokeWidth="0.5" />

      {/* Señal Contactless */}
      <path d="M52 31 A 5 5 0 0 1 52 41" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M56 28 A 8 8 0 0 1 56 44" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M60 25 A 11 11 0 0 1 60 47" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* ── ZONA CENTRAL DE SALDO (Emerge sobre la ranura al presionar) ── */}
      <g
        style={{
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.28s ease 0.1s',
        }}
      >
        {/* Etiqueta Saldo Total */}
        <text
          x="18" y="60"
          fill="#f4f4f5"
          fontSize="8.5"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="700"
          letterSpacing="1"
          opacity="0.9"
        >
          SALDO TOTAL
        </text>

        {/* Monto de saldo formateado o asteriscos según visibilidad */}
        {visible ? (
          <text
            x="18" y="82"
            fill="#ffffff"
            fontSize="21"
            fontWeight="800"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="-0.3"
          >
            ${formatCurrency(balance)}
          </text>
        ) : (
          <text
            x="18" y="82"
            fill="#ffffff"
            fontSize="21"
            fontWeight="800"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="3"
          >
            ••••••
          </text>
        )}

        {/* Titular de la tarjeta */}
        <text
          x="188" y="106"
          fill="#f4f4f5"
          fontSize="9"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="600"
          textAnchor="end"
          opacity="0.9"
        >
          {(userName || 'Usuario').toUpperCase().slice(0, 16)}
        </text>
      </g>

      {/* Borde exterior de la tarjeta */}
      <rect width="208" height="124" rx="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    </svg>
  );
}
