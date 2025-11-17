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
import BranchesPage from './pages/dashboard/BranchesPage';
import CreditAccountsPage from './pages/dashboard/CreditAccountsPage';
import CashClosurePage from './pages/dashboard/CashClosurePage';
import VouchersPage from './pages/dashboard/VouchersPage'; // 🆕 NUEVA IMPORTACIÓN

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('');

  useEffect(() => {
    if (currentView) {
      localStorage.setItem('currentView', currentView);
    }
  }, [currentView]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        const userRole = profile?.role;
        setUser({ ...session.user, role: userRole });
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
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
          const userRole = profile?.role;
          setUser({ ...session.user, role: userRole });
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
    localStorage.removeItem('currentView');
    setUser(null);
    setCurrentView('');
  };

  const renderDashboardContent = () => {
    let componentToRender;
    switch (currentView) {
      case 'dashboard': componentToRender = <DashboardPage />; break;
      case 'inventory': componentToRender = <InventoryPage />; break;
      case 'sales': componentToRender = <SalesPage />; break;
      case 'vouchers': componentToRender = <VouchersPage />; break; // 🆕 NUEVO CASE
      case 'branches': componentToRender = <BranchesPage />; break;
      case 'clients': componentToRender = <ClientsPage />; break;
      case 'suppliers': componentToRender = <SuppliersPage />; break;
      case 'credit': componentToRender = <CreditAccountsPage />; break;
      case 'cash_closure': componentToRender = <CashClosurePage />; break;
      case 'reports': componentToRender = <ReportsPage />; break;
      case 'users': componentToRender = <UsersPage />; break;
      case 'settings': componentToRender = <SettingsPage />; break;
      default:
        componentToRender = user?.role === 'Administrador' ? <DashboardPage /> : <SalesPage />;
    }
    // 🔥 Clona el componente y le pasa el 'user' como prop
    return React.cloneElement(componentToRender, { user });
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