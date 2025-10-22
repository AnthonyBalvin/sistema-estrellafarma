import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

// --- Iconos ---
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
  </div>
);

const formatCurrency = (amount) => 
  `S/ ${Number(amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function MainDashboardPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSalesToday: 0,
    totalSalesMonth: 0,
    lowStock: 0,
    expiringSoon: 0,
    clientsWithDebt: 0,
    totalDebt: 0
  });
  const [topSellers, setTopSellers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fecha de hoy y del mes
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Ventas de hoy
        const { data: salesToday } = await supabase
          .from('sales')
          .select('total_amount')
          .gte('created_at', today.toISOString());

        const totalToday = salesToday?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;

        // 2. Ventas del mes
        const { data: salesMonth } = await supabase
          .from('sales')
          .select('total_amount')
          .gte('created_at', firstDayOfMonth.toISOString());

        const totalMonth = salesMonth?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;

        // 3. Productos con stock bajo (menos de 10)
        const { data: lowStock } = await supabase
          .from('products')
          .select('id, name, stock_quantity')
          .lt('stock_quantity', 10)
          .order('stock_quantity', { ascending: true })
          .limit(5);

        // 4. Productos próximos a vencer (30 días)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const { data: expiring } = await supabase
          .from('products')
          .select('id, name, expiration_date')
          .lte('expiration_date', thirtyDaysFromNow.toISOString().split('T')[0])
          .gte('expiration_date', today.toISOString().split('T')[0])
          .order('expiration_date', { ascending: true })
          .limit(5);

        // 5. Clientes con deuda (simulado - ajustar según tu modelo)
        // Si tienes tabla de créditos, ajusta aquí
        const clientsWithDebt = 0;
        const totalDebt = 0;

        // 6. Top vendedores del mes
        const { data: salesByUser } = await supabase
          .from('sales')
          .select(`
            pharmacist_id,
            total_amount,
            profiles:pharmacist_id(full_name)
          `)
          .gte('created_at', firstDayOfMonth.toISOString());

        // Agrupar ventas por farmacéutico
        const sellerMap = {};
        salesByUser?.forEach(sale => {
          const id = sale.pharmacist_id;
          const name = sale.profiles?.full_name || 'Desconocido';
          if (!sellerMap[id]) {
            sellerMap[id] = { name, total: 0, count: 0 };
          }
          sellerMap[id].total += Number(sale.total_amount || 0);
          sellerMap[id].count += 1;
        });

        const topSellersArray = Object.entries(sellerMap)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        setStats({
          totalSalesToday: totalToday,
          totalSalesMonth: totalMonth,
          lowStock: lowStock?.length || 0,
          expiringSoon: expiring?.length || 0,
          clientsWithDebt,
          totalDebt
        });

        setTopSellers(topSellersArray);
        setLowStockProducts(lowStock || []);
        setExpiringProducts(expiring || []);

      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Principal</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Principal</h1>
        <p className="text-gray-600 mt-2">
          Resumen de las métricas clave de tu farmacia
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Ventas de Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUpIcon />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Hoy</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Ventas del Día</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSalesToday)}</p>
        </div>

        {/* Ventas del Mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUpIcon />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Mes</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Ventas del Mes</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSalesMonth)}</p>
        </div>

        {/* Stock Bajo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <PackageIcon />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">Alerta</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Stock Bajo</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.lowStock} productos</p>
        </div>

        {/* Por Vencer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangleIcon />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">30 días</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Por Vencer</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon} productos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendedores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <TrophyIcon />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Top Vendedores del Mes</h2>
          </div>
          
          {topSellers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay ventas registradas este mes</p>
          ) : (
            <div className="space-y-3">
              {topSellers.map((seller, index) => (
                <div key={seller.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{seller.name}</p>
                      <p className="text-xs text-gray-500">{seller.count} ventas</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">{formatCurrency(seller.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas de Inventario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangleIcon />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Alertas de Inventario</h2>
          </div>

          {/* Stock Bajo */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <PackageIcon />
              <span className="ml-2">Stock Bajo (menos de 10 unidades)</span>
            </h3>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500 pl-7">✓ Todos los productos tienen stock suficiente</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm">
                    <span className="text-gray-700">{product.name}</span>
                    <span className="font-bold text-orange-700">{product.stock_quantity} unid.</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos a Vencer */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <AlertTriangleIcon />
              <span className="ml-2">Próximos a Vencer (30 días)</span>
            </h3>
            {expiringProducts.length === 0 ? (
              <p className="text-sm text-gray-500 pl-7">✓ No hay productos próximos a vencer</p>
            ) : (
              <div className="space-y-2">
                {expiringProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded text-sm">
                    <span className="text-gray-700">{product.name}</span>
                    <span className="font-bold text-red-700">
                      {new Date(product.expiration_date).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}