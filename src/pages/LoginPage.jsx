// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { UserIcon, LockIcon } from '../components/Icons';
import { EstrellaFarmaLogo } from '../components/Logo';
import { supabase } from '../supabase/client';

// Estilos para la animación del fondo.
const animationStyles = `
  @keyframes move {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(10deg); }
    50% { transform: translateY(0) rotate(0eg); }
    75% { transform: translateY(20px) rotate(-10deg); }
  }
  .animate-move {
    animation: move 15s ease-in-out infinite;
  }
`;

// Iconos para mostrar/ocultar contraseña
const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 013.208-4.435m3.25-2.116A9.969 9.969 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.969 9.969 0 01-1.357 2.592M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m3-3v.01M3 3l18 18" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Limpiamos el error anterior
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // La redirección la maneja App.jsx
    } catch (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Correo o contraseña incorrectos. Intenta nuevamente.');
      } else {
        setError('Ocurrió un error. Por favor, intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen w-full bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500 rounded-full opacity-30 filter blur-3xl animate-move"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500 rounded-full opacity-30 filter blur-3xl animate-move" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full opacity-20 filter blur-3xl animate-move" style={{ animationDelay: '6s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row w-full max-w-md md:max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden
                        animate-in fade-in-50 duration-700
                        transition-all ease-in-out md:hover:-translate-y-2 md:hover:shadow-2xl md:hover:shadow-orange-500/20">
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <EstrellaFarmaLogo />

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow placeholder:text-slate-400"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>

              {/* Contenedor de Error con Diseño Mejorado */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2 rounded-md text-center transition-all duration-300">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Ingresando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>

          <div className="hidden md:block md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1974&auto-format&fit=crop"
              alt="Imagen de farmacia"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/0f172a/3b82f6?text=EstrellaFarma'; }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
