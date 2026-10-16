import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — restaura el scroll al top al cambiar de ruta.
 * Funciona con BrowserRouter (a diferencia de <ScrollRestoration />
 * que requiere createBrowserRouter/data router).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
