import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

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

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
  </div>
);

const formatCurrency = (amount) =>
  `S/ ${Number(amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Colores para gráficos
const COLORS = {
  primary: '#f97316',
  emerald: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  amber: '#f59e0b',
  teal: '#14b8a6',
  indigo: '#6366f1',
  red: '#ef4444'
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function MainDashboardPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSalesToday: 0,
    totalSalesMonth: 0,
    lowStock: 0,
    expiringSoon: 0,
  });

  // Datos para gráficos
  const [salesTrendData, setSalesTrendData] = useState([]);
  const [monthlyComparisonData, setMonthlyComparisonData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [hourlySalesData, setHourlySalesData] = useState([]);
  const [stockLevelsData, setStockLevelsData] = useState([]);

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

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

        // 3. Tendencia de ventas (últimos 7 días)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const { data: daySales } = await supabase
            .from('sales')
            .select('total_amount')
            .gte('created_at', date.toISOString())
            .lt('created_at', nextDate.toISOString());

          const total = daySales?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;

          last7Days.push({
            date: date.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }),
            ventas: Number(total.toFixed(2))
          });
        }
        setSalesTrendData(last7Days);

        // 4. Comparación mensual
        const { data: prevMonthSales } = await supabase
          .from('sales')
          .select('total_amount')
          .gte('created_at', firstDayOfPrevMonth.toISOString())
          .lt('created_at', firstDayOfMonth.toISOString());

        const totalPrevMonth = prevMonthSales?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;

        setMonthlyComparisonData([
          { mes: 'Mes Anterior', ventas: Number(totalPrevMonth.toFixed(2)) },
          { mes: 'Mes Actual', ventas: Number(totalMonth.toFixed(2)) }
        ]);

        // 5. Top 5 productos más vendidos
        const { data: saleItems } = await supabase
          .from('sale_items')
          .select('quantity, products(name)')
          .gte('created_at', firstDayOfMonth.toISOString());

        const productSales = {};
        saleItems?.forEach(item => {
          if (item.products) {
            const name = item.products.name;
            productSales[name] = (productSales[name] || 0) + item.quantity;
          }
        });

        const topProducts = Object.entries(productSales)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, quantity]) => ({
            producto: name.length > 20 ? name.substring(0, 20) + '...' : name,
            cantidad: quantity
          }));

        setTopProductsData(topProducts);

        // 6. Métodos de pago
        const { data: salesByPayment } = await supabase
          .from('sales')
          .select('payment_status, total_amount')
          .gte('created_at', firstDayOfMonth.toISOString());

        const paymentStats = { paid: 0, credit: 0 };
        salesByPayment?.forEach(sale => {
          if (sale.payment_status === 'paid') {
            paymentStats.paid += Number(sale.total_amount || 0);
          } else if (sale.payment_status === 'credit') {
            paymentStats.credit += Number(sale.total_amount || 0);
          }
        });

        setPaymentMethodsData([
          { name: 'Contado', value: Number(paymentStats.paid.toFixed(2)) },
          { name: 'Crédito', value: Number(paymentStats.credit.toFixed(2)) }
        ]);

        // 7. Ventas por hora (hoy)
        const hourlyStats = Array(24).fill(0);
        const { data: todaySales } = await supabase
          .from('sales')
          .select('created_at, total_amount')
          .gte('created_at', today.toISOString());

        todaySales?.forEach(sale => {
          const hour = new Date(sale.created_at).getHours();
          hourlyStats[hour] += Number(sale.total_amount || 0);
        });

        const hourlySales = hourlyStats.map((amount, hour) => ({
          hora: `${hour}:00`,
          ventas: Number(amount.toFixed(2))
        })).filter((_, hour) => hour >= 6 && hour <= 22);

        setHourlySalesData(hourlySales);

        // 8. Niveles de stock (nuevo gráfico)
        const { data: allProducts } = await supabase
          .from('products')
          .select('stock_quantity')
          .order('stock_quantity', { ascending: false })
          .limit(100);

        const stockRanges = {
          'Crítico (0-5)': 0,
          'Bajo (6-10)': 0,
          'Medio (11-50)': 0,
          'Alto (51-100)': 0,
          'Muy Alto (100+)': 0
        };

        allProducts?.forEach(product => {
          const qty = product.stock_quantity;
          if (qty <= 5) stockRanges['Crítico (0-5)']++;
          else if (qty <= 10) stockRanges['Bajo (6-10)']++;
          else if (qty <= 50) stockRanges['Medio (11-50)']++;
          else if (qty <= 100) stockRanges['Alto (51-100)']++;
          else stockRanges['Muy Alto (100+)']++;
        });

        setStockLevelsData(
          Object.entries(stockRanges).map(([nivel, cantidad]) => ({ nivel, cantidad }))
        );

        // 9. Productos con stock bajo
        const { data: lowStock } = await supabase
          .from('products')
          .select('id, name, stock_quantity')
          .lt('stock_quantity', 10)
          .order('stock_quantity', { ascending: true })
          .limit(5);

        // 10. Productos próximos a vencer
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const { data: expiring } = await supabase
          .from('products')
          .select('id, name, expiration_date')
          .lte('expiration_date', thirtyDaysFromNow.toISOString().split('T')[0])
          .gte('expiration_date', today.toISOString().split('T')[0])
          .order('expiration_date', { ascending: true })
          .limit(5);

        setStats({
          totalSalesToday: totalToday,
          totalSalesMonth: totalMonth,
          lowStock: lowStock?.length || 0,
          expiringSoon: expiring?.length || 0,
        });

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
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Principal</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Dashboard Principal
        </h1>
        <p className="text-gray-600">
          Resumen de las métricas clave de tu farmacia
        </p>
      </div>

      {/* Tarjetas de Métricas con Gradientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Ventas de Hoy */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 transform group-hover:scale-105 transition duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                <TrendingUpIcon />
              </div>
              <span className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full">HOY</span>
            </div>
            <h3 className="text-sm font-medium text-white/90 mb-1">Ventas del Día</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalSalesToday)}</p>
          </div>
        </div>

        {/* Ventas del Mes */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 transform group-hover:scale-105 transition duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                <TrendingUpIcon />
              </div>
              <span className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full">MES</span>
            </div>
            <h3 className="text-sm font-medium text-white/90 mb-1">Ventas del Mes</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalSalesMonth)}</p>
          </div>
        </div>

        {/* Stock Bajo */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 transform group-hover:scale-105 transition duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                <PackageIcon />
              </div>
              <span className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full">ALERTA</span>
            </div>
            <h3 className="text-sm font-medium text-white/90 mb-1">Stock Bajo</h3>
            <p className="text-3xl font-bold text-white">{stats.lowStock} productos</p>
          </div>
        </div>

        {/* Por Vencer */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-6 transform group-hover:scale-105 transition duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                <AlertTriangleIcon />
              </div>
              <span className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full">30 DÍAS</span>
            </div>
            <h3 className="text-sm font-medium text-white/90 mb-1">Por Vencer</h3>
            <p className="text-3xl font-bold text-white">{stats.expiringSoon} productos</p>
          </div>
        </div>
      </div>

      {/* Gráficos - Primera Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tendencia de Ventas (7 días) */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
            Tendencia de Ventas (7 días)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke={COLORS.emerald}
                strokeWidth={3}
                dot={{ fill: COLORS.emerald, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Comparación Mensual */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Comparación Mensual
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="ventas" fill={COLORS.blue} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos - Segunda Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top 5 Productos */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Top 5 Productos Más Vendidos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis dataKey="producto" type="category" stroke="#6b7280" width={120} style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="cantidad" fill={COLORS.purple} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métodos de Pago */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
            Distribución por Método de Pago
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos - Tercera Fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ventas por Hora */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            Ventas por Hora (Hoy)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlySalesData}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hora" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke={COLORS.amber}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVentas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Niveles de Stock */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            Distribución de Niveles de Stock
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nivel" stroke="#6b7280" style={{ fontSize: '10px' }} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                {stockLevelsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.nivel.includes('Crítico') ? COLORS.red :
                      entry.nivel.includes('Bajo') ? COLORS.amber :
                        entry.nivel.includes('Medio') ? COLORS.blue :
                          entry.nivel.includes('Alto') ? COLORS.emerald :
                            COLORS.purple
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas de Inventario */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <AlertTriangleIcon />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Alertas de Inventario</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Bajo */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <PackageIcon />
              <span className="ml-2">Stock Bajo (menos de 10 unidades)</span>
            </h3>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500 pl-7 bg-green-50 p-3 rounded-lg">✓ Todos los productos tienen stock suficiente</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg text-sm border border-orange-200 hover:bg-orange-100 transition-colors">
                    <span className="text-gray-700 font-medium">{product.name}</span>
                    <span className="font-bold text-orange-700">{product.stock_quantity} unid.</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos a Vencer */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <AlertTriangleIcon />
              <span className="ml-2">Próximos a Vencer (30 días)</span>
            </h3>
            {expiringProducts.length === 0 ? (
              <p className="text-sm text-gray-500 pl-7 bg-green-50 p-3 rounded-lg">✓ No hay productos próximos a vencer</p>
            ) : (
              <div className="space-y-2">
                {expiringProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg text-sm border border-red-200 hover:bg-red-100 transition-colors">
                    <span className="text-gray-700 font-medium">{product.name}</span>
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