import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteChangeLoader — barra de progreso superior estilo YouTube/NProgress.
 * Implementada con useLocation (compatible con BrowserRouter).
 * useNavigation() solo funciona con createBrowserRouter (data router).
 */
export function RouteChangeLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Al cambiar de ruta: mostrar barra y animar hasta 85%
    setVisible(true);
    setWidth(0);

    // Pequeño delay para que el CSS de opacity se aplique antes de animar
    const startTimer = setTimeout(() => setWidth(85), 20);

    // Completar y ocultar tras 400ms (tiempo estimado de render)
    timerRef.current = setTimeout(() => {
      setWidth(100);
      setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 250);
    }, 400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-[2.5px] overflow-hidden pointer-events-none z-50"
    >
      <div
        className="h-full bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary rounded-full relative transition-all"
        style={{
          width: `${width}%`,
          transition: width === 85
            ? 'width 350ms cubic-bezier(0.4, 0, 0.2, 1)'
            : 'width 200ms ease-in',
          boxShadow: '0 0 12px var(--color-primary), 0 0 4px var(--color-primary)',
        }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/50 blur-[2px] rounded-full" />
      </div>
    </div>
  );
}
