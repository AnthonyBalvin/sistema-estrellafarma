// src/pages/dashboard/InventoryPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase/client';

// --- Iconos ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

// --- Componentes Modales y de Notificación ---

// Función auxiliar para formatear fechas a YYYY-MM-DD para input[type="date"]
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Si ya es un objeto Date o un timestamp, lo formatea
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [supplierId, setSupplierId] = useState(''); // NUEVO: ID del Proveedor
  const [expirationDate, setExpirationDate] = useState(''); // NUEVO: Fecha de Vencimiento
  const [suppliers, setSuppliers] = useState([]); // NUEVO: Lista de proveedores para el select

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const isEditing = !!productToEdit;

  // NUEVO: Cargar lista de proveedores
  const fetchSuppliers = async () => {
    setSuppliersLoading(true);
    const { data, error } = await supabase.from('suppliers').select('id, name').order('name', { ascending: true });
    if (error) {
      console.error('Error fetching suppliers:', error.message);
      setError('No se pudieron cargar los proveedores.');
      setSuppliers([]);
    } else {
      setSuppliers(data || []);
    }
    setSuppliersLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers(); // Carga los proveedores al abrir el modal

      if (isEditing) {
        setName(productToEdit.name);
        setDescription(productToEdit.description || '');
        setPrice(productToEdit.price);
        setStockQuantity(productToEdit.stock_quantity);
        setSupplierId(productToEdit.supplier_id || ''); // Carga el ID del proveedor
        setExpirationDate(formatDateForInput(productToEdit.expiration_date)); // Carga la fecha
      } else {
        // Valores por defecto al crear
        setName(''); setDescription(''); setPrice(0); setStockQuantity(0);
        setSupplierId('');
        setExpirationDate('');
      }
      setError('');
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar que se haya seleccionado un proveedor si la lista no está vacía
    if (suppliers.length > 0 && !supplierId) {
      setError('Debe seleccionar un proveedor.');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        name,
        description,
        price,
        stock_quantity: stockQuantity,
        supplier_id: supplierId || null, // Guardar el ID del proveedor (o null si no se selecciona)
        expiration_date: expirationDate || null, // Guardar la fecha (o null)
      };

      const { error } = isEditing
        ? await supabase.from('products').update(productData).eq('id', productToEdit.id)
        : await supabase.from('products').insert(productData);

      if (error) throw error;
      onSave(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito`);
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
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Nombre</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required /></div>
          <div><label className="block text-sm font-medium text-gray-700">Descripción</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" /></div>
          
          {/* NUEVO: Campo Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Proveedor</label>
            {suppliersLoading ? (
              <p className="mt-1 text-sm text-gray-500">Cargando proveedores...</p>
            ) : (
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Seleccione un proveedor</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* NUEVO: Campo Fecha de Vencimiento */}
          <div><label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label><input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Precio (S/)</label><input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required /></div>
            <div><label className="block text-sm font-medium text-gray-700">Cantidad en Stock</label><input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required /></div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button><button type="submit" disabled={loading || suppliersLoading} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50">{loading ? 'Guardando...' : 'Guardar'}</button></div>
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

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchProducts = async () => {
    setError(null);
    try {
      // MODIFICADO: Selecciona campos de products (*), el nombre del proveedor (suppliers(name)) y la fecha de vencimiento.
      const { data, error } = await supabase
        .from('products')
        .select('*, suppliers(name)') 
        .order('name', { ascending: true });
        
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, []);

  const handleAdd = () => { setCurrentProduct(null); setIsModalOpen(true); };
  const handleEdit = (product) => { setCurrentProduct(product); setIsModalOpen(true); };
  const handleDelete = (product) => { setCurrentProduct(product); setIsDeleteModalOpen(true); };

  const confirmDelete = async () => {
    if (!currentProduct) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', currentProduct.id);
      if (error) throw error;
      setTimeout(() => {
        fetchProducts();
        showToast('Producto eliminado con éxito');
        setIsDeleteModalOpen(false);
        setIsDeleting(false);
      }, 500);
    } catch (error) {
      showToast(error.message, 'error');
      setIsDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        if (stockFilter === 'low') return product.stock_quantity > 0 && product.stock_quantity < 10;
        if (stockFilter === 'out') return product.stock_quantity === 0;
        return true;
      })
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, searchTerm, stockFilter]);

  // Función para formatear la fecha
  const formatExpirationDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(message) => { fetchProducts(); showToast(message); }} productToEdit={currentProduct} />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} message={`¿Seguro que quieres eliminar "${currentProduct?.name}"?`} loading={isDeleting} />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 shrink-0">Gestión de Inventario</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><SearchIcon /></span>
            <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="all">Todo el stock</option>
            <option value="low">Stock bajo</option>
            <option value="out">Agotados</option>
          </select>
          <button onClick={handleAdd} className="w-full sm:w-auto bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap">
            + Añadir Producto
          </button>
        </div>
      </div>

      {loading ? ( <p className="text-gray-600">Cargando productos...</p> ) : error ? ( <p className="text-red-500">Error: {error}</p> ) : (
        <div>
          {/* Vista de Tabla para Desktop */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Proveedor</th> {/* NUEVO */}
                  <th className="px-6 py-3">Descripción</th>
                  <th className="px-6 py-3">Precio</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Vencimiento</th> {/* NUEVO */}
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-500">{product.suppliers?.name || 'N/A'}</td> {/* MUESTRA NOMBRE DE PROVEEDOR */}
                    <td className="px-6 py-4 text-gray-500">{product.description}</td>
                    <td className="px-6 py-4">S/ {Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold">{product.stock_quantity}</td>
                    <td className="px-6 py-4 text-red-500 font-medium">{formatExpirationDate(product.expiration_date)}</td> {/* MUESTRA FECHA DE VENCIMIENTO */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors" title="Editar"><EditIcon /></button>
                        <button onClick={() => handleDelete(product)} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors" title="Eliminar"><DeleteIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de Tarjetas para Móvil */}
          <div className="block md:hidden space-y-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 bg-blue-100 rounded-full"><EditIcon /></button>
                    <button onClick={() => handleDelete(product)} className="p-2 text-red-600 bg-red-100 rounded-full"><DeleteIcon /></button>
                  </div>
                </div>
                
                {/* MODIFICADO: Agrega Proveedor y Vencimiento */}
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-y-2 text-sm"> 
                  <div>
                    <p className="text-xs text-gray-500">Proveedor</p>
                    <p className="font-semibold text-gray-700">{product.suppliers?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Vencimiento</p>
                    <p className="font-semibold text-red-500">{formatExpirationDate(product.expiration_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="font-semibold text-gray-700">S/ {Number(product.price).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className="font-bold text-lg text-gray-800">{product.stock_quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}