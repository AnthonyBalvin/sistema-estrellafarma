// src/pages/dashboard/SuppliersPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase/client';

// --- Iconos ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

// --- Componentes ---
const SupplierModal = ({ isOpen, onClose, onSave, supplierToEdit }) => {
  const [name, setName] = useState('');
  const [ruc, setRuc] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = !!supplierToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setName(supplierToEdit.name);
        setRuc(supplierToEdit.ruc || '');
        setContactPerson(supplierToEdit.contact_person || '');
        setPhone(supplierToEdit.phone || '');
        setEmail(supplierToEdit.email || '');
      } else {
        setName(''); setRuc(''); setContactPerson(''); setPhone(''); setEmail('');
      }
      setError('');
    }
  }, [supplierToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supplierData = { name, ruc, contact_person: contactPerson, phone, email };
      const { error } = isEditing
        ? await supabase.from('suppliers').update(supplierData).eq('id', supplierToEdit.id)
        : await supabase.from('suppliers').insert(supplierData);
      if (error) throw error;
      onSave(`Proveedor ${isEditing ? 'actualizado' : 'creado'} con éxito`);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-25">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-800">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Proveedor' : 'Añadir Nuevo Proveedor'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required /></div>
          <div><label className="block text-sm font-medium text-gray-700">RUC</label><input type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Persona de Contacto</label><input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Teléfono</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Correo Electrónico</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" /></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button><button type="submit" disabled={loading} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50">{loading ? 'Guardando...' : 'Guardar'}</button></div>
        </form>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-25">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{message}</h3>
        <p className="text-sm text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} disabled={loading} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50">{loading ? 'Eliminando...' : 'Confirmar'}</button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type, onHide }) => {
  useEffect(() => {
    const timer = setTimeout(() => onHide(), 3000);
    return () => clearTimeout(timer);
  }, [onHide]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-5 z-50`}>
      {message}
    </div>
  );
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchSuppliers = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.from('suppliers').select('*').order('name', { ascending: true });
      if (error) throw error;
      setSuppliers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSuppliers();
  }, []);

  const handleAdd = () => { setCurrentSupplier(null); setIsModalOpen(true); };
  const handleEdit = (supplier) => { setCurrentSupplier(supplier); setIsModalOpen(true); };
  const handleDelete = (supplier) => { setCurrentSupplier(supplier); setIsDeleteModalOpen(true); };

  const confirmDelete = async () => {
    if (!currentSupplier) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('suppliers').delete().eq('id', currentSupplier.id);
      if (error) throw error;
      setTimeout(() => {
        fetchSuppliers();
        showToast('Proveedor eliminado con éxito');
        setIsDeleteModalOpen(false);
        setIsDeleting(false);
      }, 500);
    } catch (error) {
      showToast(error.message, 'error');
      setIsDeleting(false);
    }
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.ruc && supplier.ruc.includes(searchTerm))
    );
  }, [suppliers, searchTerm]);

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
      <SupplierModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(message) => { fetchSuppliers(); showToast(message); }} supplierToEdit={currentSupplier} />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} message={`¿Seguro que quieres eliminar a "${currentSupplier?.name}"?`} loading={isDeleting} />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><SearchIcon /></span>
            <input type="text" placeholder="Buscar por nombre o RUC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <button onClick={handleAdd} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap">
            + Añadir Proveedor
          </button>
        </div>
      </div>

      {loading ? ( <p className="text-gray-600">Cargando proveedores...</p> ) : error ? ( <p className="text-red-500">Error: {error}</p> ) : (
        <div>
          {/* Vista de Tabla para Desktop */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">RUC</th>
                  <th className="px-6 py-3">Contacto</th>
                  <th className="px-6 py-3">Teléfono</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b hover:bg-orange-50">
                    <td className="px-6 py-4 font-medium">{supplier.name}</td>
                    <td className="px-6 py-4 text-gray-500">{supplier.ruc}</td>
                    <td className="px-6 py-4 text-gray-500">{supplier.contact_person}</td>
                    <td className="px-6 py-4 text-gray-500">{supplier.phone}</td>
                    <td className="px-6 py-4 text-gray-500">{supplier.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(supplier)} className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200" title="Editar"><EditIcon /></button>
                        <button onClick={() => handleDelete(supplier)} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200" title="Eliminar"><DeleteIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de Tarjetas para Móvil */}
          <div className="block md:hidden space-y-4">
            {filteredSuppliers.map(supplier => (
              <div key={supplier.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{supplier.name}</p>
                    <p className="text-sm text-gray-500">RUC: {supplier.ruc}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEdit(supplier)} className="p-2 text-blue-600 bg-blue-100 rounded-full"><EditIcon /></button>
                    <button onClick={() => handleDelete(supplier)} className="p-2 text-red-600 bg-red-100 rounded-full"><DeleteIcon /></button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-sm text-gray-700 space-y-1">
                  <p><strong className="font-medium">Contacto:</strong> {supplier.contact_person}</p>
                  <p><strong className="font-medium">Teléfono:</strong> {supplier.phone}</p>
                  <p><strong className="font-medium">Email:</strong> {supplier.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
