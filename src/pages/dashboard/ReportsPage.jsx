// src/pages/dashboard/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

// Iconos mejorados
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-orange-200 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

export default function ReportsPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSale, setExpandedSale] = useState(null);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    averageTicket: 0
  });

  useEffect(() => {
    const fetchSalesHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('get-sales-history');
        if (invokeError) throw invokeError;
        if (data.error) throw new Error(data.error);
        
        setSales(data);
        
        // Calcular estadísticas
        if (data.length > 0) {
          const totalRevenue = data.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
          const totalProducts = data.reduce((sum, sale) => sum + sale.sale_items.length, 0);
          const averageTicket = totalRevenue / data.length;
          
          setStats({
            totalSales: data.length,
            totalRevenue,
            totalProducts,
            averageTicket
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesHistory();
  }, []);

  const toggleSaleDetails = (saleId) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  const formatCurrency = (amount) => {
    return `S/ ${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Hoy, ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ayer, ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('es-PE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="px-6 py-6">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <ReportIcon className="text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes de Ventas</h1>
          </div>
          <p className="text-gray-600">Análisis detallado de transacciones y rendimiento de ventas</p>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Tarjetas de Estadísticas */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBagIcon className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span className="font-medium">Transacciones registradas</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CurrencyIcon className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span className="font-medium">Facturación acumulada</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productos Vendidos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ShoppingBagIcon className="text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span className="font-medium">Unidades totales</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.averageTicket)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <CurrencyIcon className="text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span className="font-medium">Por transacción</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Transacciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CalendarIcon className="mr-2 text-gray-500" />
              Historial de Transacciones
            </h2>
            <p className="text-sm text-gray-600 mt-1">Detalle completo de todas las ventas realizadas</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los datos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Intentar nuevamente
              </button>
            </div>
          ) : sales.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <ShoppingBagIcon className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
              <p className="text-gray-600">Las transacciones aparecerán aquí una vez que se realicen ventas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      <span className="sr-only">Expandir</span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2" />
                        Fecha y Hora
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <UserIcon className="mr-2" />
                        Cliente
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center">
                        <ShoppingBagIcon className="mr-2" />
                        Productos
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-end">
                        <CurrencyIcon className="mr-2" />
                        Total
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <React.Fragment key={sale.id}>
                      <tr 
                        className="hover:bg-orange-50 cursor-pointer transition-colors duration-150 group"
                        onClick={() => toggleSaleDetails(sale.id)}
                      >
                        <td className="px-6 py-4">
                          <div className={`text-gray-400 group-hover:text-orange-500 transition-all duration-200 ${expandedSale === sale.id ? 'rotate-180 text-orange-500' : ''}`}>
                            <ChevronDownIcon />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(sale.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-bold">
                                {(sale.clients?.full_name || 'A')[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {sale.clients?.full_name || 'Cliente Anónimo'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {sale.sale_items.length} item{sale.sale_items.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(sale.total_amount)}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Fila expandible con detalle */}
                      {expandedSale === sale.id && (
                        <tr className="bg-gradient-to-r from-orange-50 to-amber-50">
                          <td colSpan="5" className="px-0 py-0">
                            <div className="px-6 py-4 animate-in fade-in-50 duration-300">
                              <div className="bg-white rounded-lg border border-orange-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 bg-orange-100 border-b border-orange-200">
                                  <h4 className="font-semibold text-gray-900 flex items-center">
                                    <ShoppingBagIcon className="mr-2 text-orange-600" />
                                    Detalle de Productos
                                  </h4>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Producto
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Cantidad
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Precio Unit.
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Subtotal
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {sale.sale_items.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                          <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900">
                                              {item.products.name}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                              {item.quantity}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                                            {formatCurrency(item.unit_price)}
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                            <div className="text-sm font-semibold text-gray-900">
                                              {formatCurrency(item.unit_price * item.quantity)}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">
                                      Total de la venta:
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">
                                      {formatCurrency(sale.total_amount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}