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
      className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden"
    >
      <div
        className="h-full bg-theme-primary rounded-full"
        style={{
          width: `${width}%`,
          transition: width === 85
            ? 'width 350ms ease-out'
            : 'width 200ms ease-in',
        }}
      />
    </div>
  );
}
