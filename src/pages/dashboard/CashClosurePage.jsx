import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';

// --- Iconos ---
const CashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M6 12h.01M18 12h.01"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UnlockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"></path>
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

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
  </svg>
);

const SwitchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"></polyline>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
    <polyline points="7 23 3 19 7 15"></polyline>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
  </div>
);

const formatCurrency = (amount) => 
  `S/ ${Number(amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('es-PE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// 🔥 CAMBIO 1: Recibe el 'user' como prop
export default function CashClosurePage({ user }) {
  // 🔥 CAMBIO 2: El modo de vista inicial depende del rol del usuario
  const [viewMode, setViewMode] = useState(user?.role === 'Administrador' ? 'admin' : 'operator');
  
  const [closures, setClosures] = useState([]);
  const [activeClosure, setActiveClosure] = useState(null);
  const [todaySales, setTodaySales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [initialAmount, setInitialAmount] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [stats, setStats] = useState({
    totalOpen: 0,
    totalClosed: 0,
    totalDiscrepancies: 0,
    averageDaily: 0
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [userBranchId, setUserBranchId] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Cargar sucursales para el filtro
  const fetchBranches = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setBranches(data || []);
    } catch (err) {
      console.error('Error al cargar sucursales:', err);
    }
  }, []);

  const fetchClosures = useCallback(async () => {
    try {
      setRefreshing(true);
      
      let query = supabase
        .from('cash_closures')
        .select(`
          *,
          profiles!cash_closures_user_id_fkey(full_name, branch_id),
          branches(name)
        `)
        .order('created_at', { ascending: false });

      // 🔥 FILTRO POR ROL Y SUCURSAL
      if (user?.role !== 'Administrador') {
        // Vendedores solo ven sus propios cierres
        query = query.eq('user_id', user.id);
      } else if (selectedBranch !== 'all') {
        // Administradores pueden filtrar por sucursal
        query = query.eq('branch_id', selectedBranch);
      }

      query = query.limit(50);

      const { data: closuresData, error: closuresError } = await query;

      if (closuresError) throw closuresError;

      setClosures(closuresData || []);

      const open = closuresData?.filter(c => c.status === 'open').length || 0;
      const closed = closuresData?.filter(c => c.status === 'closed').length || 0;
      const discrepancies = closuresData?.filter(c => 
        c.status === 'closed' && 
        c.closing_amount != null &&
        c.expected_amount != null &&
        Math.abs(Number(c.closing_amount) - Number(c.expected_amount)) > 0.01
      ).length || 0;

      const closedSales = closuresData?.filter(c => 
        c.status === 'closed' && 
        c.expected_amount != null && 
        c.opening_amount != null
      ) || [];
      
      const avgDaily = closedSales.length > 0
        ? closedSales.reduce((sum, c) => sum + (Number(c.expected_amount) - Number(c.opening_amount)), 0) / closedSales.length
        : 0;

      setStats({
        totalOpen: open,
        totalClosed: closed,
        totalDiscrepancies: discrepancies,
        averageDaily: avgDaily
      });

    } catch (err) {
      console.error('Error al cargar cierres:', err);
      showError('Error al cargar los datos: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  }, [user, selectedBranch]);

  const fetchCurrentState = useCallback(async (currentUser) => {
    try {
      const { data: closure, error: closureError } = await supabase
        .from('cash_closures')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('status', 'open')
        .single();
      
      if (closureError && closureError.code !== 'PGRST116') {
        throw closureError;
      }

      setActiveClosure(closure);

      if (closure) {
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('total_amount')
          .eq('pharmacist_id', currentUser.id)
          .gte('created_at', closure.created_at);

        if (salesError) throw salesError;

        const total = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0) || 0;
        setTodaySales(total);
      } else {
        setTodaySales(0);
      }
    } catch (err) {
      showError('Error al cargar el estado de la caja: ' + err.message);
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (user) {
          // Obtener branch_id del usuario
          const { data: profile } = await supabase
            .from('profiles')
            .select('branch_id')
            .eq('id', user.id)
            .single();
          
          setUserBranchId(profile?.branch_id);
          
          if (user.role === 'Administrador') {
            await fetchBranches();
          }
          
          await fetchClosures();
          await fetchCurrentState(user);
        }
      } catch (err) {
        showError('Error al inicializar: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, fetchBranches, fetchClosures, fetchCurrentState]);

  // Recargar cuando cambie el filtro de sucursal
  useEffect(() => {
    if (!loading && user?.role === 'Administrador') {
      fetchClosures();
    }
  }, [selectedBranch]);

  const handleOpenBox = async () => {
    const amount = parseFloat(initialAmount);
    
    if (isNaN(amount) || amount < 0) {
      showError('Por favor, ingrese un monto inicial válido (mayor o igual a 0).');
      return;
    }

    try {
      setProcessing(true);

      const { error: insertError } = await supabase
        .from('cash_closures')
        .insert({
          opening_amount: amount,
          user_id: user.id,
          branch_id: userBranchId || null,
          status: 'open'
        });
      
      if (insertError) throw insertError;

      showSuccess('Caja abierta exitosamente');
      setInitialAmount('');
      await fetchCurrentState(user);
      await fetchClosures();
    } catch (err) {
      showError('Error al abrir la caja: ' + err.message);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseBox = async () => {
    const amount = parseFloat(finalAmount);
    
    if (isNaN(amount) || amount < 0) {
      showError('Por favor, ingrese un monto final válido (mayor o igual a 0).');
      return;
    }
    
    const expected = Number(activeClosure.opening_amount) + Number(todaySales);
    const difference = amount - expected;

    setShowConfirmModal({
      expected,
      final: amount,
      difference
    });
  };

  const confirmCloseBox = async () => {
    try {
      setProcessing(true);

      const { error: updateError } = await supabase
        .from('cash_closures')
        .update({
          closing_amount: showConfirmModal.final,
          expected_amount: showConfirmModal.expected,
          status: 'closed'
        })
        .eq('id', activeClosure.id);

      if (updateError) throw updateError;

      showSuccess('Caja cerrada exitosamente');
      setActiveClosure(null);
      setTodaySales(0);
      setFinalAmount('');
      setShowConfirmModal(null);
      await fetchClosures();
    } catch (err) {
      showError('Error al cerrar la caja: ' + err.message);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'open') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <UnlockIcon />
          <span className="ml-1">Abierta</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <LockIcon />
        <span className="ml-1">Cerrada</span>
      </span>
    );
  };

  const getDiscrepancyBadge = (closure) => {
    if (closure.status !== 'closed' || !closure.closing_amount || !closure.expected_amount) {
      return <span className="text-sm text-gray-400">-</span>;
    }
    
    const diff = Number(closure.closing_amount) - Number(closure.expected_amount);
    
    if (Math.abs(diff) < 0.01) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircleIcon />
          <span className="ml-1">Perfecto</span>
        </span>
      );
    }
    
    if (diff > 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          ↑ {formatCurrency(Math.abs(diff))}
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
        <AlertTriangleIcon />
        <span className="ml-1">↓ {formatCurrency(Math.abs(diff))}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangleIcon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Resumen de Cierre</h3>
                <p className="text-gray-500 text-sm">Verifica los montos antes de confirmar</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">💰 Monto Esperado</span>
                  <span className="text-lg font-bold text-blue-700">{formatCurrency(showConfirmModal.expected)}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">📊 Monto Ingresado</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(showConfirmModal.final)}</span>
                </div>

                <div className={`flex justify-between items-center p-3 rounded-lg ${
                  showConfirmModal.difference > 0 ? 'bg-green-50' :
                  showConfirmModal.difference < 0 ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  <span className="text-sm font-medium text-gray-700">
                    {showConfirmModal.difference >= 0 ? '✅' : '⚠️'} Diferencia
                  </span>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      showConfirmModal.difference > 0 ? 'text-green-700' :
                      showConfirmModal.difference < 0 ? 'text-red-700' : 'text-blue-700'
                    }`}>
                      {formatCurrency(Math.abs(showConfirmModal.difference))}
                    </span>
                    {showConfirmModal.difference !== 0 && (
                      <p className={`text-xs mt-1 ${
                        showConfirmModal.difference > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {showConfirmModal.difference > 0 ? 'Sobrante' : 'Faltante'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(null)}
                  disabled={processing}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmCloseBox}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {processing ? 'Cerrando...' : 'Confirmar Cierre'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <CashIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {viewMode === 'admin' ? 'Gestión de Arqueos' : 'Mi Caja'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {viewMode === 'admin' 
                  ? 'Vista administrativa de todos los cierres de caja' 
                  : 'Abrir y cerrar mi caja del día'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {/* 🔥 Filtro de sucursal (solo para administradores en vista admin) */}
            {user?.role === 'Administrador' && viewMode === 'admin' && (
              <div className="flex items-center gap-2">
                <FilterIcon />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Todas las sucursales</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 🔥 CAMBIO 3: Solo muestra el botón si el usuario es Administrador */}
            {user?.role === 'Administrador' && (
              <button
                onClick={() => setViewMode(viewMode === 'admin' ? 'operator' : 'admin')}
                className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-lg text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100"
              >
                <SwitchIcon />
                <span className="ml-2">
                  {viewMode === 'admin' ? 'Vista Operador' : 'Vista Admin'}
                </span>
              </button>
            )}
            
            {viewMode === 'admin' && (
              <button
                onClick={fetchClosures}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshIcon />
                <span className="ml-2">{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertTriangleIcon />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-start">
            <CheckCircleIcon />
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Operador */}
      {viewMode === 'operator' && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-3xl mx-auto">
          {activeClosure ? (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-green-50 px-6 py-3 rounded-full mb-4">
                  <div className="text-green-600 mr-3">
                    <UnlockIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700">Caja Abierta</h2>
                </div>
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <CalendarIcon />
                  <span className="ml-2">
                    Apertura: {formatDateTime(activeClosure.created_at)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Monto Inicial</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(activeClosure.opening_amount)}
                  </p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium mb-2">Ventas del Día</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(todaySales)}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium mb-2">Total Esperado</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatCurrency(Number(activeClosure.opening_amount) + Number(todaySales))}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  Cerrar Caja del Día
                </h3>
                
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Final en Caja
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={processing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg font-semibold text-center disabled:bg-gray-100"
                    />
                  </div>

                  <button
                    onClick={handleCloseBox}
                    disabled={processing || !finalAmount}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                  >
                    {processing ? 'Procesando...' : 'Cerrar Caja'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-red-50 px-6 py-3 rounded-full mb-4">
                  <div className="text-red-600 mr-3">
                    <LockIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-red-700">Caja Cerrada</h2>
                </div>
                <p className="text-gray-600 mt-2">
                  Debe abrir la caja para poder registrar ventas del día.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Inicial en Caja
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    placeholder="0.00"
                    disabled={processing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg font-semibold text-center disabled:bg-gray-100"
                  />
                </div>

                <button
                  onClick={handleOpenBox}
                  disabled={processing || !initialAmount}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  {processing ? 'Procesando...' : 'Abrir Caja'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista de Administrador */}
      {viewMode === 'admin' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UnlockIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cajas Abiertas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOpen}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <LockIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cajas Cerradas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClosed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangleIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Con Diferencias</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDiscrepancies}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ChartIcon />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Promedio Ventas</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.averageDaily)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Historial de Arqueos</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmacéutico</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sucursal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto Inicial</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ventas</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Esperado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Final</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diferencia</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {closures.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                        No hay registros de arqueos de caja
                      </td>
                    </tr>
                  ) : (
                    closures.map((closure) => (
                      <tr key={closure.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <CalendarIcon />
                            <span className="ml-2 text-gray-900">{formatDateTime(closure.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <UserIcon />
                            <span className="ml-2 text-gray-900">{closure.profiles?.full_name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <BuildingIcon />
                            <span className="ml-2 text-gray-700">{closure.branches?.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(closure.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                          {formatCurrency(closure.opening_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                          {closure.expected_amount && closure.opening_amount
                            ? formatCurrency(Number(closure.expected_amount) - Number(closure.opening_amount))
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-medium">
                          {closure.expected_amount ? formatCurrency(closure.expected_amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                          {closure.closing_amount ? formatCurrency(closure.closing_amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getDiscrepancyBadge(closure)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}