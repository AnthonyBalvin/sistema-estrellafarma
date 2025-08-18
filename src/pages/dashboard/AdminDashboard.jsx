// src/pages/dashboard/AdminDashboard.jsx
import React from 'react';

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default function AdminDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-800 text-white animate-in fade-in-50 duration-500">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Bienvenido,</h1>
        <p className="text-4xl font-semibold mt-2 text-orange-400">{user.role}</p>

        <div className="mt-8 bg-black/20 p-6 rounded-lg">
          <h2 className="text-2xl">Panel de Administración</h2>
          <p className="text-slate-300 mt-2">Aquí gestionarás usuarios, reportes y configuraciones.</p>
        </div>

        <button 
          onClick={onLogout}
          className="mt-12 flex items-center justify-center gap-2 text-slate-300 hover:text-white bg-red-500/50 hover:bg-red-500/80 px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <LogoutIcon />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}