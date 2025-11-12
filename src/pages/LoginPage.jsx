// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { supabase } from '../supabase/client';

// Iconos
const UserIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

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

const StarIcon = () => (
  <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    <div className="min-h-screen w-full bg-[#1a2332] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos bokeh azules brillantes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -15px); }
        }
      `}</style>
      
      {/* Círculos bokeh en el fondo */}
      <div className="absolute -bottom-48 left-1/4 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl" style={{animation: 'float 20s ease-in-out infinite'}}></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" style={{animation: 'float 25s ease-in-out infinite', animationDelay: '5s'}}></div>
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-cyan-300/15 rounded-full blur-3xl" style={{animation: 'float 22s ease-in-out infinite', animationDelay: '3s'}}></div>
      <div className="absolute bottom-32 right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" style={{animation: 'float 28s ease-in-out infinite', animationDelay: '7s'}}></div>
      
      {/* Contenedor principal más ancho */}
      <div className="w-full max-w-7xl flex rounded-3xl overflow-hidden shadow-2xl relative z-10">
        {/* Panel izquierdo - Formulario */}
        <div className="w-full lg:w-1/2 bg-slate-800/90 backdrop-blur-sm p-8 lg:p-16 flex flex-col justify-center">
          {/* Logo y título */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <StarIcon />
              <h1 className="text-3xl font-bold text-white">EstrellaFarma</h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Bienvenido</h2>
            <p className="text-slate-400 text-sm">Accede a tu cuenta profesional</p>
            <div className="w-16 h-1 bg-orange-500 mt-3 rounded-full"></div>
          </div>

          {/* Formulario */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Correo electrónico</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <UserIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@estrellafarma.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Botón de login */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-orange-500 text-white font-semibold py-3.5 rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-orange-500/20"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </div>

          {/* Footer del formulario */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-400 text-center mb-3">Sistema de gestión farmacéutica</p>
            <div className="flex items-center justify-center gap-2 text-orange-500">
              <GlobeIcon />
              <span className="text-sm font-medium">EstrellaFarma Professional</span>
            </div>
          </div>
        </div>

        {/* Panel derecho - Imagen e información */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-700 relative overflow-hidden">
          {/* Imagen de fondo con efecto bokeh */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop"
              alt="Medicamentos con efecto bokeh"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70"></div>
          </div>

          {/* Contenido superpuesto */}
          <div className="relative z-10 p-16 flex flex-col justify-end text-white">
            <h3 className="text-3xl font-bold mb-4">Gestión Profesional</h3>
            <p className="text-slate-200 text-lg mb-8 leading-relaxed">
              Sistema integral para farmacias modernas. Controla inventario, ventas y clientes de manera eficiente.
            </p>
            
            <div className="flex items-center gap-3 text-sm">
              <ShieldIcon />
              <span className="text-slate-200">Seguro y confiable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}