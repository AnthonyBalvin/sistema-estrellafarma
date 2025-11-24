// src/pages/dashboard/BranchesPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { supabase } from '../../supabase/client';

// --- Iconos ---
const BuildingIcon = ({ className = "" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;


// --- Toast ---
const Toast = ({ message, type, onHide }) => {
    useEffect(() => {
        const timer = setTimeout(() => onHide(), 3000);
        return () => clearTimeout(timer);
    }, [onHide]);
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-5 rounded-lg shadow-lg z-50`}>{message}</div>;
};

// --- Modal Añadir/Editar Sucursal ---
const BranchModal = ({ isOpen, onClose, onSave, branchToEdit }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (branchToEdit) {
            setName(branchToEdit.name || '');
            setAddress(branchToEdit.address || '');
            setPhone(branchToEdit.phone?.[0] || ''); // Usamos el primer elemento si 'phone' es un array
            setOpeningHours(branchToEdit.opening_hours || '');
        } else {
            setName('');
            setAddress('');
            setPhone('');
            setOpeningHours('');
        }
        setError('');
    }, [branchToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const branchData = {
                name,
                address,
                phone: [phone], // Guardar como array
                opening_hours: openingHours
            };

            if (branchToEdit) {
                const { error } = await supabase
                    .from('branches')
                    .update(branchData)
                    .eq('id', branchToEdit.id);
                if (error) throw error;
                onSave('Sucursal actualizada con éxito');
            } else {
                const { error } = await supabase
                    .from('branches')
                    .insert([branchData]);
                if (error) throw error;
                onSave('Sucursal creada con éxito');
            }
            onClose();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-800">
                <h2 className="text-2xl font-bold mb-6">{branchToEdit ? 'Editar' : 'Añadir'} Sucursal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de la Sucursal</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input 
                            type="text" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Horario de Atención</label>
                        <input 
                            type="text" 
                            value={openingHours} 
                            onChange={(e) => setOpeningHours(e.target.value)} 
                            placeholder="Ej: 8:00 AM - 9:00 PM"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            required 
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={loading} 
                            className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : branchToEdit ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Modal de Confirmación ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{message}</h3>
                <p className="text-sm text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        disabled={loading} 
                        className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={loading} 
                        className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? 'Eliminando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal ---
export default function BranchesPage() {
    const [branches, setBranches] = useState([]);

    const [profiles, setProfiles] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const [appTheme, setAppTheme] = useState(() => localStorage.getItem('appTheme') || 'light');
    const isDark = appTheme === 'dark';

    useEffect(() => {
        const handler = () => setAppTheme(localStorage.getItem('appTheme') || 'light');
        window.addEventListener('appThemeChanged', handler);
        return () => window.removeEventListener('appThemeChanged', handler);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Cargar sucursales, perfiles (empleados) y ventas al mismo tiempo
            const [branchesRes, profilesRes, salesRes] = await Promise.all([
                supabase.from('branches').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('id, full_name, branch_id'),
                supabase.from('sales').select('pharmacist_id, total_amount')
            ]);

            if (branchesRes.error) throw branchesRes.error;
            if (profilesRes.error) throw profilesRes.error;
            if (salesRes.error) throw salesRes.error;

            setBranches(branchesRes.data);
            setProfiles(profilesRes.data);
            setSales(salesRes.data);

        } catch (error) {
            setError(error.message);
            showToast('Error al cargar datos', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Lógica para procesar los datos de sucursales, empleados y ventas
    const processedBranches = useMemo(() => {
        // Objeto para calcular el total de ventas por empleado
        const salesByEmployee = sales.reduce((acc, sale) => {
            acc[sale.pharmacist_id] = (acc[sale.pharmacist_id] || 0) + sale.total_amount;
            return acc;
        }, {});

        return branches.map(branch => {
            // Filtrar y enriquecer empleados de esta sucursal
            const employees = profiles
                .filter(p => p.branch_id === branch.id)
                .map(employee => ({
                    ...employee,
                    total_sales: salesByEmployee[employee.id] || 0
                }));

            return {
                ...branch,
                employees: employees
            };
        });
    }, [branches, profiles, sales]);

    const handleEdit = (branch) => {
        setCurrentBranch(branch);
        setIsModalOpen(true);
    };

    const handleDelete = (branch) => {
        setCurrentBranch(branch);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!currentBranch) return;
        setIsDeleting(true);
        try {
            // 1. Desasignar a todos los usuarios de esta sucursal (branch_id a null)
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ branch_id: null })
                .eq('branch_id', currentBranch.id);

            if (updateError) throw updateError;

            // 2. Eliminar la sucursal
            const { error: deleteError } = await supabase
                .from('branches')
                .delete()
                .eq('id', currentBranch.id);
            
            if (deleteError) throw deleteError;

            // Actualizar la lista de sucursales y notificar
            fetchData();
            showToast('Sucursal eliminada con éxito');

        } catch (error) {
            showToast(`Error al eliminar: ${error.message}`, 'error');
        } finally {
            setIsDeleteModalOpen(false);
            setIsDeleting(false);
        }
    };
    
    const handleAddNew = () => {
        setCurrentBranch(null);
        setIsModalOpen(true);
    };
    
    const formatCurrency = (amount) => `S/ ${Number(amount).toFixed(2)}`;

    // Función para determinar si es una sucursal principal
    const isMainBranch = (branchName) => {
        return branchName?.toLowerCase().includes('admin') || 
               branchName?.toLowerCase().includes('central') || 
               branchName?.toLowerCase().includes('principal');
    };
    
    return (
        <>
            {/* Modales y Toast */}
            {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
            <BranchModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={(message) => { fetchData(); showToast(message); }} 
                branchToEdit={currentBranch}
            />
            <ConfirmationModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={confirmDelete}
                message={`¿Seguro que quieres eliminar la sucursal "${currentBranch?.name || ''}"? Esto desasignará al personal.`}
                loading={isDeleting}
            />

            <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                {/* Header */}
                <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b mb-8`}>
                    <div className="px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-3 ${isDark ? 'bg-slate-700' : 'bg-orange-100'}`}>
                                    <BuildingIcon />
                                </div>
                                <div>
                                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Gestión de Sucursales</h1>
                                    <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Control y administración de todas las ubicaciones</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleAddNew}
                                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                <PlusIcon />
                                <span className="ml-2">Nueva Sucursal</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Contenido de Sucursales */}
                <div className="px-6 pb-8">

                    {loading ? ( 
                        <p className="text-gray-600 text-lg text-center p-10">Cargando sucursales...</p> 
                    ) : error ? ( 
                        <p className="text-red-500 text-lg text-center p-10">Error: {error}</p> 
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {processedBranches.map((branch) => (
                                <div key={branch.id} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl border p-6 flex flex-col hover:shadow-lg transition-all duration-300`}>
                                    
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                                                isMainBranch(branch.name)
                                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                                                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                            }`}>
                                                {isMainBranch(branch.name) ? (
                                                    <StarIcon className="text-white" />
                                                ) : (
                                                    <BuildingIcon className="text-white w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {branch.name}
                                                </h3>
                                                {isMainBranch(branch.name) && (
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${isDark ? 'bg-slate-700 text-orange-300' : 'bg-orange-100 text-orange-800'}`}>
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleEdit(branch)} 
                                                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:text-orange-400 hover:bg-slate-700' : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'}`}
                                            >
                                                <EditIcon />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(branch)} 
                                                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:text-red-400 hover:bg-slate-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className={`flex items-center text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                            <MapPinIcon />
                                            <span className="ml-2">{branch.address || 'Sin dirección'}</span>
                                        </div>
                                        <div className={`flex items-center text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                            <PhoneIcon />
                                            <span className="ml-2">{branch.phone?.[0] || 'Sin teléfono'}</span>
                                        </div>
                                        <div className={`flex items-center text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                            <ClockIcon />
                                            <span className="ml-2">{branch.opening_hours || 'Sin horario'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Sección de Empleados y Ventas */}
                                    <div className={`border-t pt-4 mt-auto ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                                        <h4 className={`text-sm font-semibold mb-3 flex items-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            <UsersIcon className={`mr-2 ${isDark ? 'text-slate-300' : 'text-gray-400'}`} /> Personal y Ventas ({branch.employees.length})
                                        </h4>
                                        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                            {branch.employees.length > 0 ? (
                                                branch.employees.sort((a, b) => b.total_sales - a.total_sales).map(employee => (
                                                    <div key={employee.id} className="flex justify-between items-center text-sm">
                                                        <span className={`${isDark ? 'text-slate-200' : 'text-gray-700'} truncate`}>{employee.full_name}</span>
                                                        <span className={`font-semibold px-2 py-1 rounded-full whitespace-nowrap ${isDark ? 'text-blue-400 bg-slate-700' : 'text-blue-600 bg-blue-50'}`}>
                                                            {formatCurrency(employee.total_sales)}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className={`text-sm text-center py-2 ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>No hay personal o ventas asignadas.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}