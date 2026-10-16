import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../utils/format';

/**
 * LeatherWallet — Billetera de cuero interactiva con SVG puro.
 * Al presionar la billetera, una tarjeta de crédito se desliza hacia afuera
 * mostrando el saldo total. Sin dependencias externas (no Three.js necesario).
 */
export default function LeatherWallet({ totalBalance, userName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => setIsOpen(prev => !prev);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* ── ESCENA DE LA BILLETERA ─────────────────────────── */}
      <div
        className="relative cursor-pointer"
        style={{ width: 220, height: 200 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleToggle}
        role="button"
        aria-label={isOpen ? 'Cerrar billetera' : 'Abrir billetera para ver saldo'}
      >
        {/* ── TARJETA QUE SALE ─────────────────────── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 wallet-card"
          style={{
            bottom: isOpen ? '130px' : '20px',
            opacity: isOpen ? 1 : 0,
            transition: 'bottom 0.55s cubic-bezier(0.34,1.4,0.64,1), opacity 0.3s ease',
            width: 190,
            zIndex: 5,
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          <CreditCard
            balance={totalBalance}
            visible={isBalanceVisible}
            userName={userName}
          />
        </div>

        {/* ── SVG BILLETERA DE CUERO ─────────────────── */}
        <svg
          viewBox="0 0 220 160"
          width="220"
          height="160"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            filter: 'drop-shadow(0 8px 24px rgba(92,51,23,0.35))',
            transform: isHovered && !isOpen ? 'translateY(-4px) rotate(-1deg)' : isOpen ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'transform 0.35s cubic-bezier(0.34,1.2,0.64,1)',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente cuero principal */}
            <linearGradient id="leatherMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B4513" />
              <stop offset="30%" stopColor="#A0522D" />
              <stop offset="65%" stopColor="#7B3A10" />
              <stop offset="100%" stopColor="#5C3317" />
            </linearGradient>

            {/* Cuero frente (más claro) */}
            <linearGradient id="leatherFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A0522D" />
              <stop offset="40%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#6B3410" />
            </linearGradient>

            {/* Gradiente solapa */}
            <linearGradient id="leatherFlap" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B3A10" />
              <stop offset="100%" stopColor="#5C2D0E" />
            </linearGradient>

            {/* Brillo cuero */}
            <linearGradient id="leatherSheen" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Textura cuero oscura */}
            <linearGradient id="leatherDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3D1C08" />
              <stop offset="100%" stopColor="#2A1005" />
            </linearGradient>

            {/* Oro broche */}
            <radialGradient id="goldBuckle" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>

            {/* Sombra billetera */}
            <filter id="wShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#3D1C08" floodOpacity="0.5" />
            </filter>

            {/* Patrón textura cuero */}
            <pattern id="leatherTexture" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="none" />
              <line x1="0" y1="2" x2="4" y2="2" stroke="#5C2D0E" strokeWidth="0.3" strokeOpacity="0.4" />
              <line x1="2" y1="0" x2="2" y2="4" stroke="#5C2D0E" strokeWidth="0.3" strokeOpacity="0.25" />
            </pattern>
          </defs>

          {/* ── CUERPO TRASERO ── */}
          <rect
            x="10" y="30" width="200" height="120"
            rx="16"
            fill="url(#leatherMain)"
            filter="url(#wShadow)"
          />
          {/* Textura */}
          <rect x="10" y="30" width="200" height="120" rx="16" fill="url(#leatherTexture)" />
          {/* Pespunte exterior */}
          <rect
            x="16" y="36" width="188" height="108"
            rx="12" fill="none"
            stroke="#C87941" strokeWidth="1.2"
            strokeDasharray="5 4"
            strokeOpacity="0.7"
          />

          {/* ── BOLSILLO FRONTAL ── */}
          <rect
            x="10" y="68" width="200" height="82"
            rx="0"
            fill="url(#leatherFront)"
          />
          <rect
            x="10" y="68" width="200" height="82"
            rx="0"
            fill="url(#leatherTexture)"
          />
          {/* Borde inferior redondeado del bolsillo */}
          <rect
            x="10" y="68" width="200" height="82"
            rx="16"
            fill="url(#leatherFront)"
            clipPath="url(#bottomClip)"
          />

          {/* Definir clip para redondear solo abajo */}
          <defs>
            <clipPath id="bottomClip">
              <rect x="10" y="90" width="200" height="60" rx="14" />
            </clipPath>
          </defs>

          {/* Franja divisoria bolsillo */}
          <line
            x1="10" y1="68" x2="210" y2="68"
            stroke="#5C2D0E" strokeWidth="2.5"
          />

          {/* Pespunte bolsillo frontal */}
          <path
            d="M18 76 L202 76 L202 140 C202 148, 195 150, 188 150 L32 150 C25 150, 18 148, 18 140 Z"
            fill="none"
            stroke="#C87941" strokeWidth="1"
            strokeDasharray="5 4"
            strokeOpacity="0.6"
          />

          {/* ── SOLAPA / LENGÜETA ── */}
          <path
            d="M160 82 L200 82 C208 82, 214 88, 214 96 C214 104, 208 110, 200 110 L160 110 Z"
            fill="url(#leatherFlap)"
          />
          {/* Textura solapa */}
          <path
            d="M160 82 L200 82 C208 82, 214 88, 214 96 C214 104, 208 110, 200 110 L160 110 Z"
            fill="url(#leatherTexture)"
          />
          {/* Pespunte solapa */}
          <path
            d="M164 86 L198 86 C204 86, 209 91, 209 96 C209 101, 204 106, 198 106 L164 106"
            fill="none"
            stroke="#C87941" strokeWidth="0.9"
            strokeDasharray="4 3"
            strokeOpacity="0.65"
          />
          {/* Broche dorado */}
          <circle cx="201" cy="96" r="9" fill="url(#goldBuckle)" stroke="#D97706" strokeWidth="1.2" />
          <circle cx="201" cy="96" r="5.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
          <circle cx="201" cy="96" r="2.5" fill="#92400E" />

          {/* ── BRILLO SUPERFICIAL CUERO ── */}
          <rect
            x="10" y="30" width="200" height="120"
            rx="16"
            fill="url(#leatherSheen)"
          />

          {/* ── TAPAS RANURAS TARJETAS (arriba billetera) ── */}
          {isOpen && (
            <>
              <rect x="50" y="28" width="120" height="8" rx="2" fill="#7B3A10" opacity="0.7" />
            </>
          )}

          {/* ── MONOGRAMA / LOGO ── */}
          <text
            x="42" y="110"
            fill="#C87941"
            fontSize="11"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="3"
            opacity="0.75"
          >
            MCZ
          </text>

          {/* ── LÍNEAS DECORATIVAS CUERO (venas del material) ── */}
          <path d="M28 50 Q60 42 90 48" stroke="#7B3A10" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M28 58 Q70 52 100 57" stroke="#7B3A10" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M28 130 Q80 134 140 130" stroke="#7B3A10" strokeWidth="0.5" fill="none" opacity="0.3" />
        </svg>

        {/* ── INDICADOR "TAP" ── */}
        {!isOpen && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
            style={{
              animation: 'walletPulse 2s ease-in-out infinite',
              opacity: isHovered ? 0 : 0.7,
              transition: 'opacity 0.2s',
            }}
          >
            <div className="w-8 h-[3px] bg-amber-700/50 rounded-full" />
          </div>
        )}
      </div>

      {/* ── LABEL ACCIÓN ── */}
      <p className="text-xs font-semibold text-amber-800/70 dark:text-amber-400/60 tracking-wide uppercase">
        {isOpen ? 'Toca para cerrar' : 'Toca para ver saldo'}
      </p>

      {/* ── BOTÓN OJO (solo visible cuando tarjeta está abierta) ── */}
      {isOpen && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsBalanceVisible(v => !v); }}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          {isBalanceVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          {isBalanceVisible ? 'Ocultar' : 'Mostrar'}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TARJETA DE CRÉDITO / DÉBITO SVG
   ───────────────────────────────────────────────────────── */
function CreditCard({ balance, visible, userName }) {
  return (
    <svg
      viewBox="0 0 190 110"
      width="190"
      height="110"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.35))',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <defs>
        {/* Gradiente color primario de la tarjeta */}
        <linearGradient id="cardPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="55%" stopColor="var(--color-primary-hover)" />
          <stop offset="100%" stopColor="var(--color-secondary)" />
        </linearGradient>

        {/* Brillo tarjeta */}
        <linearGradient id="cardSheen" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Chip dorado */}
        <linearGradient id="chipGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Efecto holográfico */}
        <linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.25" />
          <stop offset="33%" stopColor="#34D399" stopOpacity="0.2" />
          <stop offset="66%" stopColor="#FBBF24" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F472B6" stopOpacity="0.25" />
        </linearGradient>

        <filter id="cardGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Fondo tarjeta con gradiente primario */}
      <rect width="190" height="110" rx="14" fill="url(#cardPrimary)" />

      {/* Capa holográfica sutil */}
      <rect width="190" height="110" rx="14" fill="url(#holo)" />

      {/* Círculos decorativos de fondo */}
      <circle cx="155" cy="-10" r="70" fill="rgba(255,255,255,0.07)" />
      <circle cx="170" cy="90" r="55" fill="rgba(255,255,255,0.05)" />
      <circle cx="-10" cy="80" r="50" fill="rgba(255,255,255,0.06)" />

      {/* Brillo superior */}
      <rect width="190" height="110" rx="14" fill="url(#cardSheen)" />

      {/* ── CHIP EMV ── */}
      <rect x="18" y="30" width="30" height="22" rx="5" fill="url(#chipGold)" stroke="#B45309" strokeWidth="0.8" />
      {/* Líneas chip */}
      <line x1="18" y1="41" x2="48" y2="41" stroke="#92400E" strokeWidth="0.7" />
      <line x1="33" y1="30" x2="33" y2="52" stroke="#92400E" strokeWidth="0.7" />
      <line x1="18" y1="35" x2="48" y2="35" stroke="#92400E" strokeWidth="0.4" strokeOpacity="0.5" />
      <line x1="18" y1="47" x2="48" y2="47" stroke="#92400E" strokeWidth="0.4" strokeOpacity="0.5" />
      <line x1="25" y1="30" x2="25" y2="52" stroke="#92400E" strokeWidth="0.4" strokeOpacity="0.5" />
      <line x1="41" y1="30" x2="41" y2="52" stroke="#92400E" strokeWidth="0.4" strokeOpacity="0.5" />

      {/* ── SEÑAL CONTACTLESS ── */}
      <path d="M55 36 A 6 6 0 0 1 55 46" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M59 32 A 10 10 0 0 1 59 50" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M63 28 A 14 14 0 0 1 63 54" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45" />

      {/* ── NOMBRE APP / LOGO ── */}
      <text x="18" y="19" fill="white" fontSize="9.5" fontWeight="800"
        fontFamily="Space Grotesk, sans-serif" letterSpacing="1.5" opacity="0.9">
        MISCUENTAZ
      </text>

      {/* ── BALANCE ── */}
      {visible ? (
        <>
          <text x="18" y="82" fill="rgba(255,255,255,0.65)" fontSize="7.5"
            fontFamily="Space Grotesk, sans-serif" fontWeight="600" letterSpacing="0.5">
            SALDO TOTAL
          </text>
          <text x="18" y="100" fill="white" fontSize="19" fontWeight="800"
            fontFamily="Space Grotesk, sans-serif" letterSpacing="-0.5">
            ${formatCurrency(balance)}
          </text>
        </>
      ) : (
        <>
          <text x="18" y="82" fill="rgba(255,255,255,0.65)" fontSize="7.5"
            fontFamily="Space Grotesk, sans-serif" fontWeight="600">
            SALDO TOTAL
          </text>
          <text x="18" y="100" fill="white" fontSize="19" fontWeight="800"
            fontFamily="Space Grotesk, sans-serif" letterSpacing="3">
            ••••••
          </text>
        </>
      )}

      {/* ── NOMBRE USUARIO ── */}
      <text x="172" y="100" fill="rgba(255,255,255,0.7)" fontSize="7"
        fontFamily="Space Grotesk, sans-serif" fontWeight="600" textAnchor="end">
        {(userName || 'Usuario').toUpperCase().slice(0, 18)}
      </text>

      {/* ── LOGO VISA/MASTERCARD ESTILIZADO ── */}
      <circle cx="168" cy="30" r="9" fill="rgba(255,255,255,0.18)" />
      <circle cx="179" cy="30" r="9" fill="rgba(255,255,255,0.12)" />

      {/* Borde tarjeta sutil */}
      <rect width="190" height="110" rx="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  );
}
