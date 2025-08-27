// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';

// Iconos
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const CalendarClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h5"></path><path d="M17.5 17.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"></path><path d="M17.5 15.25V17.5l1.25 1.25"></path></svg>;
const ReceiptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h6"></path><path d="M12 14v-4"></path></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export default function DashboardLayout({ children, user, onLogout, currentView, setCurrentView }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAdmin = user.role === 'Administrador';

  const navItems = [
    { name: 'Dashboard', view: 'dashboard', icon: <HomeIcon />, adminOnly: true },
    { name: 'Ventas', view: 'sales', icon: <ShoppingCartIcon />, adminOnly: false },
    { name: 'Inventario', view: 'inventory', icon: <BoxIcon />, adminOnly: false },
    { name: 'Cuentas por Cobrar', view: 'credit', icon: <ReceiptIcon />, adminOnly: false },
    { name: 'Clientes', view: 'clients', icon: <BriefcaseIcon />, adminOnly: false },
    { name: 'Proveedores', view: 'suppliers', icon: <TruckIcon />, adminOnly: false },
    { name: 'Vencimientos', view: 'expirations', icon: <CalendarClockIcon />, adminOnly: false },
    { name: 'Reportes', view: 'reports', icon: <ChartIcon />, adminOnly: true },
    { name: 'Usuarios', view: 'users', icon: <UsersIcon />, adminOnly: true },
    { name: 'Configuración', view: 'settings', icon: <SettingsIcon />, adminOnly: true },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100 flex font-sans">
      {/* Overlay para cerrar el menú en móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-gray-200 flex flex-col shadow-lg 
                         transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                         md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/><path d="M12 8V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 11.5H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-xl font-bold text-white">EstrellaFarma</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {navItems.map(item => {
              if (item.adminOnly && !isAdmin) return null;
              const isActive = currentView === item.view;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => { setCurrentView(item.view); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-orange-500 text-white font-semibold shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-700 p-4">
          <div className="p-3 bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-orange-400 font-semibold">{user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 text-gray-300 hover:text-white bg-red-600/70 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            <LogoutIcon />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal con cabecera para móvil */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex justify-between items-center bg-white p-4 shadow-md sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700 p-2">
            <MenuIcon />
          </button>
          <span className="text-lg font-bold text-gray-800">EstrellaFarma</span>
        </header>
        <main className="flex-grow p-4 md:p-8 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

