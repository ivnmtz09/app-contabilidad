import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../utils/format';

/**
 * LeatherWallet — Portatarjetas ejecutivo artesanal interactivo (Luxury Leather Cardholder).
 *
 * Arquitectura espacial por capas SVG:
 * - Capa 0 (z-0):  Respaldo de cuero artesanal (Backplate) con pespuntes crema.
 * - Capa 1 (z-1):  Tarjeta posterior Titanium Black.
 * - Capa 2 (z-2):  Tarjeta posterior Emerald Fintech.
 * - Capa 3 (z-3):  Separador de ranura intermedia (Mid-tier divider).
 * - Capa 4 (z-4):  Tarjeta Principal Interactiva (MisCuentaZ con saldo protegido).
 * - Capa 10 (z-10): Bolsillo frontal de cuero con corte ergonómico para el pulgar,
 *                  pespuntes dobles y repujado "MISCUENTAZ".
 *
 * Modo Sigilo (Stealth Mode):
 * En reposo, la tarjeta principal descansa profundamente oculta dentro del portatarjetas;
 * el bolsillo frontal opaco cubre y resguarda el saldo total y cifras privadas.
 * Al tocar el portatarjetas, la tarjeta se desliza hacia arriba con física elástica de resorte,
 * revelando el saldo con alta jerarquía visual y contraste impecable.
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
              ? 'translateY(-4px) rotateX(4deg) scale(1.02)'
              : isOpen
              ? 'translateY(-2px)'
              : 'translateY(0)',
          }}
        >
          {/* ── CAPA 0: RESPALDO DE CUERO ARTESANAL (Base Posterior) ── */}
          <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
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
            </svg>
          </div>

          {/* ── CAPA 1: TARJETA SECUNDARIA POSTERIOR 1 (Titanium Black) ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-xl border border-zinc-700/60 shadow-md transition-all duration-500"
            style={{
              width: 196,
              height: 110,
              bottom: isOpen ? '90px' : '48px',
              zIndex: 1,
              background: 'linear-gradient(135deg, #18181b 0%, #27272a 60%, #09090b 100%)',
              transform: isOpen ? 'rotate(-3deg) scale(0.96)' : 'rotate(-1.5deg)',
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
            className="absolute left-1/2 -translate-x-1/2 rounded-xl border border-emerald-500/30 shadow-md transition-all duration-500"
            style={{
              width: 200,
              height: 110,
              bottom: isOpen ? '106px' : '36px',
              zIndex: 2,
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)',
              transform: isOpen ? 'rotate(3deg) scale(0.98)' : 'rotate(1deg)',
              opacity: 0.95,
            }}
          >
            <div className="flex justify-between items-center px-4 pt-2.5">
              <span className="text-[8px] font-display font-bold tracking-wider text-emerald-200">PREMIUM</span>
              <span className="text-[9px] font-bold text-white/90">VISA</span>
            </div>
          </div>

          {/* ── CAPA 3: SEPARADOR DE RANURA INTERMEDIA ── */}
          <div className="absolute bottom-0 left-0 w-full z-3 pointer-events-none">
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
            </svg>
          </div>

          {/* ── CAPA 4: TARJETA PRINCIPAL INTERACTIVA (Saldo Total en Modo Sigilo) ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 wallet-card transition-all"
            style={{
              /* En reposo, descansa a 8px ocultando por completo las cifras tras el bolsillo frontal */
              bottom: isOpen ? '124px' : '8px',
              transition: 'bottom 0.55s cubic-bezier(0.34, 1.42, 0.64, 1), transform 0.4s ease',
              transform: isOpen ? 'translateX(-50%) rotate(-0.5deg)' : 'translateX(-50%) rotate(0deg)',
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

          {/* ── CAPA 10: BOLSILLO FRONTAL DE CUERO (Cubre y Oculta el Saldo en Reposo) ── */}
          <div
            className="absolute bottom-0 left-0 w-full z-10 pointer-events-none"
            style={{
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

              {/* Cuerpo del bolsillo frontal con corte ergonómico */}
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

              {/* Bisel superior del corte frontal */}
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
   TARJETA FINANCIERA SVG — ALTA JERARQUÍA Y MODO SIGILO
   ───────────────────────────────────────────────────────── */
function CreditCard({ balance, visible, userName, isOpen }) {
  return (
    <svg
      viewBox="0 0 208 122"
      width="208"
      height="122"
      role="img"
      aria-label="Tarjeta financiera con saldo"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: isOpen
          ? 'drop-shadow(0 18px 34px rgba(0, 0, 0, 0.48))'
          : 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.3))',
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
          <stop offset="45%" stopColor="#090d16" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#090d16" stopOpacity="0.75" />
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
      <rect width="208" height="122" rx="14" fill="url(#cardHolderPrimaryGrad)" />

      {/* Degradado protector de contraste para garantizar legibilidad */}
      <rect width="208" height="122" rx="14" fill="url(#cardContrastProtection)" />

      {/* Formas geométricas sutiles de fondo */}
      <circle cx="170" cy="-10" r="75" fill="rgba(255,255,255,0.08)" />
      <circle cx="180" cy="95" r="55" fill="rgba(255,255,255,0.06)" />
      <circle cx="-10" cy="85" r="50" fill="rgba(255,255,255,0.06)" />

      {/* Capa de brillo superior */}
      <rect width="208" height="122" rx="14" fill="url(#cardSheen)" />

      {/* ── PARTE SUPERIOR (Visible cuando la tarjeta está insertada) ── */}
      {/* Nombre de la aplicación / Logo de la tarjeta */}
      <text
        x="20" y="21"
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
      <circle cx="178" cy="24" r="9.5" fill="rgba(255,255,255,0.28)" />
      <circle cx="189" cy="24" r="9.5" fill="rgba(255,255,255,0.18)" />

      {/* Chip EMV y señal Contactless */}
      <rect x="20" y="32" width="32" height="23" rx="5" fill="url(#chipGoldGrad)" stroke="#92400e" strokeWidth="0.8" />
      <line x1="20" y1="43.5" x2="52" y2="43.5" stroke="#78350f" strokeWidth="0.6" />
      <line x1="36" y1="32" x2="36" y2="55" stroke="#78350f" strokeWidth="0.6" />
      <line x1="20" y1="37" x2="52" y2="37" stroke="#78350f" strokeWidth="0.4" strokeOpacity="0.6" />
      <line x1="20" y1="49" x2="52" y2="49" stroke="#78350f" strokeWidth="0.4" strokeOpacity="0.6" />

      {/* Señal Contactless */}
      <path d="M58 37 A 6 6 0 0 1 58 49" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M62 33 A 10 10 0 0 1 62 53" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M66 29 A 14 14 0 0 1 66 57" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* ── PARTE INFERIOR (Oculta tras el portatarjetas en reposo, revelada al presionar) ── */}
      <g
        style={{
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.28s ease 0.12s',
        }}
      >
        {/* Etiqueta Saldo Total */}
        <text
          x="20" y="87"
          fill="#f4f4f5"
          fontSize="9"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="600"
          letterSpacing="0.8"
          opacity="0.95"
        >
          SALDO TOTAL
        </text>

        {/* Monto de saldo formateado o asteriscos según visibilidad */}
        {visible ? (
          <text
            x="20" y="109"
            fill="#ffffff"
            fontSize="22"
            fontWeight="800"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="-0.3"
          >
            ${formatCurrency(balance)}
          </text>
        ) : (
          <text
            x="20" y="109"
            fill="#ffffff"
            fontSize="22"
            fontWeight="800"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="3"
          >
            ••••••
          </text>
        )}

        {/* Titular de la tarjeta */}
        <text
          x="188" y="109"
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
      <rect width="208" height="122" rx="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    </svg>
  );
}
