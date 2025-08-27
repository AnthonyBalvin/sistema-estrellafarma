// src/App.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase/client';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
// Importamos TODAS las páginas del dashboard
import DashboardPage from './pages/dashboard/MainDashboardPage';
import InventoryPage from './pages/dashboard/InventoryPage';
import SalesPage from './pages/dashboard/SalesPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import UsersPage from './pages/dashboard/UsersPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ClientsPage from './pages/dashboard/ClientsPage';
import SuppliersPage from './pages/dashboard/SuppliersPage';
import ExpirationsPage from './pages/dashboard/ExpirationsPage';
import CreditAccountsPage from './pages/dashboard/CreditAccountsPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('');

  // Guardar currentView en localStorage cuando cambie
  useEffect(() => {
    if (currentView) {
      localStorage.setItem('currentView', currentView);
    }
  }, [currentView]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const userRole = profile?.role;
        setUser({ ...session.user, role: userRole });

        // Obtener vista previa desde localStorage o establecer por defecto
        const storedView = localStorage.getItem('currentView');
        const defaultView = userRole === 'Administrador' ? 'dashboard' : 'sales';
        setCurrentView(storedView || defaultView);
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const fetchProfile = async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const userRole = profile?.role;
          setUser({ ...session.user, role: userRole });

          // Obtener vista previa desde localStorage o establecer por defecto
          const storedView = localStorage.getItem('currentView');
          const defaultView = userRole === 'Administrador' ? 'dashboard' : 'sales';
          setCurrentView(storedView || defaultView);
        };
        fetchProfile();
      } else {
        setUser(null);
        setCurrentView('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentView'); // Limpiar localStorage
    setUser(null);
    setCurrentView('');
  };

  const renderDashboardContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'sales':
        return <SalesPage />;
      case 'credit':
        return <CreditAccountsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'expirations':
        return <ExpirationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return user?.role === 'Administrador' ? <DashboardPage /> : <SalesPage />;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <>
      {!user ? (
        <LoginPage />
      ) : (
        <DashboardLayout
          user={user}
          onLogout={handleLogout}
          currentView={currentView}
          setCurrentView={setCurrentView}
        >
          {renderDashboardContent()}
        </DashboardLayout>
      )}
    </>
  );
}

export default App;
