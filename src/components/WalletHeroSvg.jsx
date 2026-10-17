export default function WalletHeroSvg({ className = "w-full h-auto max-h-[300px]" }) {
  return (
    <svg
      viewBox="0 0 540 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="walletHeroTitle walletHeroDesc"
    >
      <title id="walletHeroTitle">Ilustración de billetera financiera inteligente</title>
      <desc id="walletHeroDesc">Billetera moderna con billetes de alta denominación, tarjetas bancarias y monedas con acabados metálicos.</desc>

      <defs>
        {/* Filtros de sombra calibrados para profundidad sin aberraciones */}
        <filter id="heroWalletShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#090d16" floodOpacity="0.4" />
        </filter>
        <filter id="heroCoinShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#090d16" floodOpacity="0.3" />
        </filter>
        <filter id="heroBillShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#090d16" floodOpacity="0.28" />
        </filter>

        {/* Gradientes Billetera adaptables al Sistema de Temas (v4 Tokens) */}
        <linearGradient id="walletBackGrad" x1="120" y1="130" x2="420" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#111827" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>

        <linearGradient id="walletFrontGrad" x1="100" y1="180" x2="440" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-primary, #7c3aed)" stopOpacity="0.95" />
          <stop offset="50%" stopColor="var(--color-primary-hover, #5b21b6)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="walletFlapGrad" x1="360" y1="210" x2="480" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-primary, #8b5cf6)" />
          <stop offset="100%" stopColor="var(--color-primary-hover, #6d28d9)" />
        </linearGradient>

        {/* Gradientes Billetes (Verde Esmeralda de Alta Legibilidad y Contraste) */}
        <linearGradient id="billGrad1" x1="0" y1="0" x2="260" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="40%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="billGrad2" x1="0" y1="0" x2="280" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="45%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="billGrad3" x1="0" y1="0" x2="270" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        {/* Tarjetas Bancarias */}
        <linearGradient id="cardPrimaryThemeGrad" x1="0" y1="0" x2="210" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-primary, #8b5cf6)" />
          <stop offset="70%" stopColor="var(--color-primary-hover, #6d28d9)" />
          <stop offset="100%" stopColor="var(--color-secondary, #10b981)" />
        </linearGradient>

        <linearGradient id="cardGlassGrad" x1="0" y1="0" x2="210" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>

        {/* Monedas Metálicas con Alto Contraste */}
        <linearGradient id="goldCoinGrad" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#fbbf24" />
          <stop offset="80%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <linearGradient id="emeraldCoinGrad" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="var(--color-secondary, #10b981)" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
      </defs>

      {/* Halo ambiental dinámico sincronizado con el tema primario y secundario */}
      <circle cx="270" cy="200" r="150" fill="var(--color-secondary, #10b981)" opacity="0.16" filter="blur(55px)" />
      <circle cx="340" cy="230" r="120" fill="var(--color-primary, #8b5cf6)" opacity="0.22" filter="blur(45px)" />

      {/* ── GRUPO: BILLETES EN ABANICO (Jerarquía y contraste mejorados) ── */}
      <g filter="url(#heroBillShadow)">
        {/* Billete 1 (Inclinado hacia la izquierda: 100K) */}
        <g transform="translate(115, 65) rotate(-14)">
          <rect width="250" height="120" rx="12" fill="url(#billGrad1)" stroke="#064e3b" strokeWidth="1.2" strokeOpacity="0.4" />
          {/* Patrón de seguridad */}
          <rect x="8" y="8" width="234" height="104" rx="8" fill="none" stroke="#065f46" strokeWidth="1" strokeDasharray="4 3" opacity="0.45" />

          {/* Medallón central con alto contraste (WCAG AAA) */}
          <circle cx="125" cy="60" r="30" fill="#064e3b" stroke="#ecfdf5" strokeWidth="2" />
          <text x="125" y="69" fill="#ffffff" fontSize="24" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">$</text>

          {/* Denominaciones en esquinas con placas de alto contraste */}
          <rect x="14" y="16" width="46" height="20" rx="4" fill="#064e3b" fillOpacity="0.85" />
          <text x="37" y="30" fill="#ecfdf5" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">100K</text>

          <rect x="190" y="84" width="46" height="20" rx="4" fill="#064e3b" fillOpacity="0.85" />
          <text x="213" y="98" fill="#ecfdf5" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">100K</text>

          {/* Línea de seguridad holográfica */}
          <line x1="68" y1="8" x2="68" y2="112" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="9 5" opacity="0.85" />
        </g>

        {/* Billete 2 (Inclinado hacia la derecha: 50K) */}
        <g transform="translate(195, 45) rotate(11)">
          <rect width="255" height="122" rx="12" fill="url(#billGrad2)" stroke="#065f46" strokeWidth="1.2" strokeOpacity="0.45" />
          <rect x="8" y="8" width="239" height="106" rx="8" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="5 3" opacity="0.45" />

          {/* Medallón central */}
          <circle cx="128" cy="61" r="32" fill="#064e3b" stroke="#f0fdf4" strokeWidth="2" />
          <text x="128" y="70" fill="#ffffff" fontSize="26" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">$</text>

          {/* Denominaciones con contraste garantizado */}
          <rect x="16" y="16" width="42" height="20" rx="4" fill="#064e3b" fillOpacity="0.85" />
          <text x="37" y="30" fill="#ecfdf5" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">50K</text>

          <rect x="196" y="86" width="42" height="20" rx="4" fill="#064e3b" fillOpacity="0.85" />
          <text x="217" y="100" fill="#ecfdf5" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">50K</text>

          {/* Hilo de seguridad dorado */}
          <line x1="178" y1="8" x2="178" y2="114" stroke="#fef08a" strokeWidth="3" strokeDasharray="6 4" opacity="0.9" />
        </g>

        {/* Billete 3 (Frontal en el centro: 20K) */}
        <g transform="translate(145, 75) rotate(-2)">
          <rect width="260" height="125" rx="12" fill="url(#billGrad3)" stroke="#064e3b" strokeWidth="1.5" strokeOpacity="0.6" />
          <rect x="10" y="10" width="240" height="105" rx="9" fill="none" stroke="#a7f3d0" strokeWidth="1.2" strokeOpacity="0.5" />

          {/* Medallón central */}
          <circle cx="130" cy="62" r="34" fill="#022c22" stroke="#ffffff" strokeWidth="2" />
          <text x="130" y="72" fill="#ffffff" fontSize="28" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">$</text>

          {/* Denominaciones */}
          <rect x="16" y="18" width="42" height="20" rx="4" fill="#022c22" fillOpacity="0.85" />
          <text x="37" y="32" fill="#ecfdf5" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">20K</text>

          <rect x="202" y="87" width="42" height="20" rx="4" fill="#022c22" fillOpacity="0.85" />
          <text x="223" y="101" fill="#ecfdf5" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">20K</text>

          {/* Franja de seguridad metálica */}
          <rect x="75" y="10" width="8" height="105" fill="#ffffff" fillOpacity="0.5" rx="2" />
        </g>
      </g>

      {/* ── GRUPO: TARJETAS BANCARIAS ── */}
      {/* Tarjeta 1: Adaptada al tema primario */}
      <g transform="translate(110, 110) rotate(-8)">
        <rect width="190" height="115" rx="12" fill="url(#cardPrimaryThemeGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        {/* Chip EMV dorado */}
        <rect x="22" y="35" width="30" height="24" rx="5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
        <line x1="22" y1="47" x2="52" y2="47" stroke="#92400e" strokeWidth="0.8" />
        <line x1="37" y1="35" x2="37" y2="59" stroke="#92400e" strokeWidth="0.8" />
        {/* Señal contactless */}
        <path d="M60 41 A 8 8 0 0 1 60 53 M64 38 A 12 12 0 0 1 64 56" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* Logotipo en tarjeta */}
        <text x="165" y="32" fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="end" fontFamily="Space Grotesk, sans-serif">VISA</text>
        <rect x="22" y="80" width="100" height="6" rx="3" fill="#ffffff" fillOpacity="0.45" />
      </g>

      {/* Tarjeta 2: Frosted Glass con acentos legibles */}
      <g transform="translate(250, 100) rotate(9)">
        <rect width="185" height="110" rx="12" fill="url(#cardGlassGrad)" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" />
        <rect x="20" y="32" width="28" height="22" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        {/* Logotipo MisCuentaZ en la tarjeta */}
        <text x="165" y="32" fill="#0f172a" fontSize="11" fontWeight="800" textAnchor="end" fontFamily="Space Grotesk, sans-serif" opacity="0.9">PREMIUM</text>
        <circle cx="140" cy="85" r="12" fill="#ef4444" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
        <circle cx="154" cy="85" r="12" fill="#f59e0b" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
      </g>

      {/* ── GRUPO: CUERPO PRINCIPAL DE LA BILLETERA ── */}
      <g filter="url(#heroWalletShadow)">
        {/* Parte trasera */}
        <rect x="80" y="145" width="380" height="200" rx="32" fill="url(#walletBackGrad)" stroke="var(--color-primary, #8b5cf6)" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Pespunte decorativo superior */}
        <rect x="88" y="153" width="364" height="184" rx="26" fill="none" stroke="#e0e7ff" strokeWidth="1.5" strokeDasharray="6 5" strokeOpacity="0.3" />

        {/* Bolsillo Frontal / Cuerpo exterior con degradado del tema */}
        <path
          d="M 80 200 
             C 140 215, 200 218, 270 218 
             C 340 218, 400 215, 460 200 
             L 460 315 
             C 460 332, 446 345, 428 345 
             L 112 345 
             C 94 345, 80 332, 80 315 
             Z"
          fill="url(#walletFrontGrad)"
          stroke="#c7d2fe"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Pespuntes en el bolsillo frontal */}
        <path
          d="M 88 208 
             C 144 222, 202 225, 270 225 
             C 338 225, 396 222, 452 208 
             L 452 312 
             C 452 326, 440 337, 425 337 
             L 115 337 
             C 100 337, 88 326, 88 312 
             Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          strokeOpacity="0.45"
        />

        {/* Correa o Solapa de Cierre Lateral */}
        <g>
          <path
            d="M 410 230 
               L 475 230 
               C 495 230, 508 244, 508 262 
               C 508 280, 495 294, 475 294 
               L 410 294 
               Z"
            fill="url(#walletFlapGrad)"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          {/* Pespunte en la solapa */}
          <path
            d="M 414 236 
               L 472 236 
               C 488 236, 499 248, 499 262 
               C 499 276, 488 288, 472 288 
               L 414 288"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeOpacity="0.6"
          />
          {/* Broche Magnético Metálico Dorado */}
          <circle cx="474" cy="262" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <circle cx="474" cy="262" r="9" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
          <circle cx="474" cy="262" r="4" fill="#78350f" />
        </g>
      </g>

      {/* ── GRUPO: MONEDAS CON CONTRASTE METÁLICO ── */}
      {/* Moneda 1: Dorada grande al frente */}
      <g transform="translate(68, 260)" filter="url(#heroCoinShadow)">
        <ellipse cx="32" cy="32" rx="32" ry="32" fill="url(#goldCoinGrad)" stroke="#fef08a" strokeWidth="2" />
        <ellipse cx="32" cy="32" rx="25" ry="25" fill="none" stroke="#92400e" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="32" y="41" fill="#451a03" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">$</text>
      </g>

      {/* Moneda 2: Esmeralda flotando derecha */}
      <g transform="translate(425, 140)" filter="url(#heroCoinShadow)">
        <ellipse cx="24" cy="24" rx="24" ry="24" fill="url(#emeraldCoinGrad)" stroke="#ecfdf5" strokeWidth="1.8" />
        <ellipse cx="24" cy="24" rx="18" ry="18" fill="none" stroke="#064e3b" strokeWidth="1" strokeDasharray="3 2" />
        <text x="24" y="32" fill="#ffffff" fontSize="19" fontWeight="900" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">$</text>
      </g>

      {/* Moneda 3: Dorada pequeña en ángulo */}
      <g transform="translate(160, 295) rotate(-18)" filter="url(#heroCoinShadow)">
        <ellipse cx="18" cy="18" rx="18" ry="18" fill="url(#goldCoinGrad)" stroke="#fef08a" strokeWidth="1.5" />
        <text x="18" y="24" fill="#451a03" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">$</text>
      </g>

      {/* ── GRUPO: DESTELLOS Y DETALLES MINIMALISTAS ── */}
      <path
        d="M 285 20 L 288 28 L 296 31 L 288 34 L 285 42 L 282 34 L 274 31 L 282 28 Z"
        fill="var(--color-secondary, #34d399)"
        opacity="0.9"
      />
      <path
        d="M 85 90 L 87 96 L 93 98 L 87 100 L 85 106 L 83 100 L 77 98 L 83 96 Z"
        fill="var(--color-primary, #c084fc)"
        opacity="0.85"
      />
      <path
        d="M 470 80 L 472 87 L 479 89 L 472 91 L 470 98 L 468 91 L 461 89 L 468 87 Z"
        fill="#fbbf24"
        opacity="0.95"
      />
    </svg>
  );
}
