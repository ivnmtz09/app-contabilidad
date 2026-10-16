import { useNavigation } from 'react-router-dom';

/**
 * Barra de progreso superior estilo YouTube/NProgress.
 * Se activa automáticamente cuando React Router está cargando una ruta.
 * No requiere librerías externas — usa useNavigation() de React Router v7.
 */
export function RouteChangeLoader() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div
      aria-hidden="true"
      className={`absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`h-full bg-theme-primary rounded-full transition-all duration-500 ease-out ${
          isLoading ? 'w-3/4' : 'w-full'
        }`}
      />
    </div>
  );
}
