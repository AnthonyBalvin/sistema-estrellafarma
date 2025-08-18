// src/App.jsx
import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import PharmacistDashboard from './pages/dashboard/PharmacistDashboard';
import { supabase } from './supabase/client'; // Importamos nuestro cliente

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si estamos verificando la sesión

  // Este efecto se ejecuta una sola vez para verificar si ya hay una sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setUser({ ...session.user, role: profile?.role });
      }
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       if (session) {
         // Si el usuario inicia sesión, buscamos su rol
          const fetchProfile = async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            setUser({ ...session.user, role: profile?.role });
          }
          fetchProfile();
       } else {
         // Si el usuario cierra sesión
         setUser(null);
       }
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Si todavía estamos cargando, mostramos un mensaje
  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando...</div>;
  }

  // Función para renderizar el componente correcto
  const renderContent = () => {
    if (!user) return <LoginPage />; // LoginPage ahora manejará el login por sí misma

    switch (user.role) {
      case 'Administrador':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case 'Farmacéutico':
        return <PharmacistDashboard user={user} onLogout={handleLogout} />;
      default:
        // Si el usuario no tiene rol, lo mandamos al login
        return <LoginPage />;
    }
  };

  return <>{renderContent()}</>;
}

export default App;
