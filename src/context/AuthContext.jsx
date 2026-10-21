import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

/**
 * AuthProvider centraliza el estado de autenticación.
 * Los componentes hijos acceden al user ya resuelto,
 * evitando la condición de carrera con Firestore.
 */
export function AuthProvider({ children }) {
  const isDemo = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('demo') === 'true' ||
    localStorage.getItem('demo_mode') === 'true'
  );

  // undefined = cargando, null = no autenticado, objeto = autenticado
  const [user, setUser] = useState(isDemo ? {
    uid: 'demo-user',
    displayName: 'Ivan Martinez',
    email: 'ivan@miscuentaz.app',
    isDemo: true
  } : undefined);

  useEffect(() => {
    if (isDemo) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [isDemo]);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
