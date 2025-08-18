// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { UserIcon, LockIcon } from '../components/Icons';
import { EstrellaFarmaLogo } from '../components/Logo';
import { supabase } from '../supabase/client'; // Importamos el cliente de Supabase

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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      // El 'onAuthStateChange' en App.jsx se encargará de la redirección

    } catch (error) {
      setError(error.message || 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen w-full bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">

        {/* Fondo animado */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500 rounded-full opacity-30 filter blur-3xl animate-move"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500 rounded-full opacity-30 filter blur-3xl animate-move" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full opacity-20 filter blur-3xl animate-move" style={{animationDelay: '6s'}}></div>
        </div>

        {/* Contenedor Principal */}
        <div className="relative z-10 flex flex-col md:flex-row w-full max-w-sm md:max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden
                        animate-in fade-in-50 duration-700
                        transition-all ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20">

          {/* Lado Izquierdo: Formulario */}
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña" 
                  className="w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow placeholder:text-slate-400"
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <div className="pt-6">
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

          {/* Lado Derecho: Imagen */}
          <div className="hidden md:block md:w-1/2">
             <img 
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1974&auto-format&fit=crop"
              alt="Imagen de una enfermera"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x800/0f172a/3b82f6?text=EstrellaFarma'; }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
