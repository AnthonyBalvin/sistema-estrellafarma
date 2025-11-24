import React, { useState, useEffect } from 'react';

// --- Iconos ---
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M1 12h6m6 0h6m-13.2 5.2l4.2-4.2m0-6l-4.2-4.2"></path>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const Toast = ({ message, onHide }) => {
  useEffect(() => {
    const timer = setTimeout(() => onHide(), 3000);
    return () => clearTimeout(timer);
  }, [onHide]);
  
  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg z-50 font-medium">
      ✓ {message}
    </div>
  );
};

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [showToast, setShowToast] = useState(false);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Cambiar tema
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    window.dispatchEvent(new Event('appThemeChanged'));
    setShowToast(true);
  };

  const isDark = theme === 'dark';
  
  // Colores que combinan con tu sidebar azul oscuro (#1e293b y similares)
  const bgColor = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const subTextColor = isDark ? 'text-slate-300' : 'text-slate-600';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';
  const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100';

  return (
    <>
      {showToast && (
        <Toast 
          message="Tema actualizado exitosamente" 
          onHide={() => setShowToast(false)} 
        />
      )}

      <div className={`min-h-screen ${bgColor} p-6 transition-colors duration-300`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="p-3 bg-orange-500 rounded-xl mr-4 shadow-lg">
              <SettingsIcon />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${textColor}`}>
                Configuración
              </h1>
              <p className={`${subTextColor} mt-1`}>
                Personaliza la apariencia del sistema
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className={`${cardBg} rounded-2xl shadow-xl border ${borderColor} p-8 max-w-5xl mx-auto`}>
          <h2 className={`text-2xl font-bold ${textColor} mb-2`}>
            Selecciona tu tema preferido
          </h2>
          <p className={`${subTextColor} mb-8`}>
            Elige entre modo claro u oscuro para una mejor experiencia visual
          </p>

          {/* Opciones de tema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tema Claro */}
            <button
              onClick={() => handleThemeChange('light')}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                theme === 'light'
                  ? 'border-orange-500 shadow-2xl scale-105 bg-white'
                  : `border-slate-300 ${hoverBg}`
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`mb-4 transition-colors ${theme === 'light' ? 'text-orange-500' : 'text-slate-400'}`}>
                  <SunIcon />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-slate-600'}`}>
                  Tema Claro
                </h3>
                <p className="text-sm text-slate-500 text-center mb-4">
                  Ideal para ambientes con buena iluminación
                </p>
                {theme === 'light' && (
                  <div className="px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold shadow-lg">
                    ✓ Activado
                  </div>
                )}
              </div>
            </button>

            {/* Tema Oscuro */}
            <button
              onClick={() => handleThemeChange('dark')}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-orange-500 shadow-2xl scale-105 bg-slate-800'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`mb-4 transition-colors ${theme === 'dark' ? 'text-orange-500' : 'text-slate-400'}`}>
                  <MoonIcon />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>
                  Tema Oscuro
                </h3>
                <p className={`text-sm text-center mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Reduce el cansancio visual en ambientes con poca luz
                </p>
                {theme === 'dark' && (
                  <div className="px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold shadow-lg">
                    ✓ Activado
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Información */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-blue-50 border-blue-200'} border`}>
            <div className="flex items-start">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h4 className={`font-semibold mb-2 ${textColor}`}>
                  Información
                </h4>
                <p className={`text-sm ${subTextColor}`}>
                  El tema seleccionado se guardará automáticamente y se aplicará en todas las páginas de la aplicación. 
                  Puedes cambiarlo en cualquier momento desde esta sección.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa */}
        <div className={`${cardBg} rounded-2xl shadow-xl border ${borderColor} p-8 max-w-5xl mx-auto mt-6`}>
          <h3 className={`text-xl font-bold ${textColor} mb-6`}>
            Vista previa del tema actual
          </h3>
          
          <div className="space-y-4">
            {/* Ejemplo de card */}
            <div className={`p-5 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
              <p className={`${textColor} font-semibold text-lg mb-1`}>Texto principal</p>
              <p className={`${subTextColor} text-sm`}>Este es un ejemplo de texto secundario en tu tema actual</p>
            </div>

            {/* Ejemplo de botones */}
            <div className="flex gap-3 flex-wrap">
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md">
                Botón Principal
              </button>
              <button className={`px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm ${
                isDark 
                  ? 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
              }`}>
                Botón Secundario
              </button>
              <button className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isDark 
                  ? 'text-slate-300 hover:bg-slate-800' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}>
                Botón Terciario
              </button>
            </div>

            {/* Ejemplo de lista */}
            <div className={`p-5 rounded-xl border ${borderColor}`}>
              <h4 className={`${textColor} font-semibold mb-3`}>Lista de ejemplo</h4>
              <ul className="space-y-2">
                {['Elemento 1', 'Elemento 2', 'Elemento 3'].map((item, i) => (
                  <li key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} ${subTextColor} transition-colors ${isDark ? 'hover:bg-slate-600' : 'hover:bg-slate-100'} cursor-pointer`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}