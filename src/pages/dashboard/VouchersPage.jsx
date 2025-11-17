import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import VoucherModal from '../../components/VoucherModal';

// Iconos
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const Toast = ({ message, type, onHide }) => {
  useEffect(() => {
    const timer = setTimeout(() => onHide(), 3000);
    return () => clearTimeout(timer);
  }, [onHide]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-5 rounded-lg shadow-lg z-50`}>
      {message}
    </div>
  );
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vouchers_with_details')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setVouchers(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewVoucher = async (voucher) => {
    try {
      // Obtener los items de la venta
      const { data: saleItems, error } = await supabase
        .from('sale_items')
        .select(`
          quantity,
          unit_price,
          products (name)
        `)
        .eq('sale_id', voucher.sale_id);

      if (error) throw error;

      const voucherData = {
        voucherNumber: voucher.voucher_number,
        issueDate: voucher.issue_date,
        clientName: voucher.client_name || 'Cliente Anónimo',
        clientDni: voucher.client_dni || '',
        items: saleItems.map(item => ({
          name: item.products.name,
          quantity: item.quantity,
          price: item.unit_price,
        })),
        totalAmount: voucher.total_amount,
        pharmacistName: voucher.pharmacist_name || 'Sistema',
        branchName: voucher.branch_name || 'Principal',
        branchAddress: voucher.branch_address || 'Av. Principal 123',
        branchPhone: voucher.branch_phone || '(01) 234-5678',
        paymentStatus: voucher.payment_status,
      };

      setSelectedVoucher(voucherData);
      setIsVoucherModalOpen(true);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleCancelVoucher = async (voucherId) => {
    if (!confirm('¿Estás seguro de anular este comprobante?')) return;

    try {
      const { error } = await supabase
        .from('vouchers')
        .update({ status: 'cancelled' })
        .eq('id', voucherId);

      if (error) throw error;
      
      showToast('Comprobante anulado exitosamente');
      fetchVouchers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(voucher => {
      // Filtro de búsqueda
      const matchesSearch = 
        voucher.voucher_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (voucher.client_name && voucher.client_name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de estado
      const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;

      // Filtro de fecha
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const voucherDate = new Date(voucher.issue_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case 'today':
            matchesDate = voucherDate >= today;
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = voucherDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = voucherDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [vouchers, searchTerm, dateFilter, statusFilter]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalVouchers = filteredVouchers.length;
  const totalAmount = filteredVouchers.reduce((sum, v) => sum + parseFloat(v.total_amount), 0);
  const activeVouchers = filteredVouchers.filter(v => v.status === 'active').length;

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
      
      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        voucherData={selectedVoucher}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Comprobantes</h1>
            <p className="text-gray-600 mt-1">Administra y consulta todos los comprobantes emitidos</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-blue-100 text-sm font-medium">Total Comprobantes</p>
            <p className="text-3xl font-bold mt-2">{totalVouchers}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-green-100 text-sm font-medium">Comprobantes Activos</p>
            <p className="text-3xl font-bold mt-2">{activeVouchers}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-orange-100 text-sm font-medium">Monto Total</p>
            <p className="text-3xl font-bold mt-2">S/ {totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por número o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Todas</option>
                <option value="today">Hoy</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="cancelled">Anulados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Comprobantes */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando comprobantes...</p>
            </div>
          ) : filteredVouchers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron comprobantes</p>
            </div>
          ) : (
            <>
              {/* Vista Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">N° Comprobante</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Monto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredVouchers.map((voucher) => (
                      <tr key={voucher.id} className="hover:bg-orange-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{voucher.voucher_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(voucher.issue_date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{voucher.client_name || 'Anónimo'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">S/ {parseFloat(voucher.total_amount).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            voucher.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {voucher.status === 'active' ? 'Activo' : 'Anulado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewVoucher(voucher)}
                              className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Ver comprobante"
                            >
                              <EyeIcon />
                            </button>
                            {voucher.status === 'active' && (
                              <button
                                onClick={() => handleCancelVoucher(voucher.id)}
                                className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                                title="Anular comprobante"
                              >
                                <XCircleIcon />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista Mobile */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredVouchers.map((voucher) => (
                  <div key={voucher.id} className="p-4 hover:bg-orange-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{voucher.voucher_number}</p>
                        <p className="text-sm text-gray-600">{formatDate(voucher.issue_date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        voucher.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {voucher.status === 'active' ? 'Activo' : 'Anulado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{voucher.client_name || 'Cliente Anónimo'}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-800">S/ {parseFloat(voucher.total_amount).toFixed(2)}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewVoucher(voucher)}
                          className="p-2 text-blue-600 bg-blue-100 rounded-lg"
                        >
                          <EyeIcon />
                        </button>
                        {voucher.status === 'active' && (
                          <button
                            onClick={() => handleCancelVoucher(voucher.id)}
                            className="p-2 text-red-600 bg-red-100 rounded-lg"
                          >
                            <XCircleIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}