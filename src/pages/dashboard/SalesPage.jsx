// src/pages/dashboard/SalesPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabase/client';
import VoucherModal from '../../components/VoucherModal'; // Importar el modal

// --- Iconos ---
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

// --- Componente de Notificación (Toast) ---
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

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [isCredit, setIsCredit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [user, setUser] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  
  // Estados para el comprobante
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherData, setVoucherData] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        const { data: productsData, error: productsError } = await supabase.from('products').select('*');
        if (productsError) throw productsError;
        setProducts(productsData);

        const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
        if (clientsError) throw clientsError;
        setClients(clientsData);

      } catch (error) {
        setError(error.message);
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        showToast('No hay más stock disponible para este producto.', 'error');
      }
    } else {
       if (product.stock_quantity > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
       } else {
        showToast('Este producto está agotado.', 'error');
       }
    }
  };

  const updateQuantity = (productId, amount) => {
    const itemInCart = cart.find(item => item.id === productId);
    const productInStock = products.find(p => p.id === productId);
    const newQuantity = itemInCart.quantity + amount;

    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else if (newQuantity > productInStock.stock_quantity) {
      showToast('No hay más stock disponible.', 'error');
    } else {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const changeAmount = useMemo(() => {
    const paid = parseFloat(amountPaid);
    if (!paid || paid < totalAmount) return 0;
    return paid - totalAmount;
  }, [amountPaid, totalAmount]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    return products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
  }, [products, productSearch]);

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      showToast('El carrito está vacío.', 'error');
      return;
    }
    if (!user) {
      showToast('No se pudo identificar al farmacéutico.', 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Crear la venta
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          total_amount: totalAmount,
          payment_status: isCredit ? 'credit' : 'paid',
          pharmacist_id: user.id,
          client_id: selectedClient || null,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // 2. Insertar los items de la venta
      const saleItems = cart.map(item => ({
        sale_id: saleData.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase.from('sale_items').insert(saleItems);
      if (itemsError) throw itemsError;

      // 3. Actualizar stock de productos
      for (const item of cart) {
        const newStock = item.stock_quantity - item.quantity;
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock_quantity: newStock })
          .eq('id', item.id);
        if (stockError) throw stockError;
      }

      // 4. Generar número de comprobante usando la función
      const { data: voucherNumberData, error: voucherNumberError } = await supabase
        .rpc('generate_voucher_number', { voucher_type_param: 'boleta' });
      
      if (voucherNumberError) throw voucherNumberError;

      // 5. Crear el comprobante
      const { data: voucherCreated, error: voucherError } = await supabase
        .from('vouchers')
        .insert({
          sale_id: saleData.id,
          voucher_number: voucherNumberData,
          voucher_type: 'boleta',
          status: 'active',
        })
        .select()
        .single();

      if (voucherError) throw voucherError;

      // 6. Obtener datos del cliente y farmacéutico
      const clientData = selectedClient 
        ? clients.find(c => c.id === selectedClient)
        : null;

      const { data: pharmacistData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // 7. Preparar datos para el modal del comprobante
      const voucher = {
        voucherNumber: voucherNumberData,
        issueDate: new Date().toISOString(),
        clientName: clientData?.full_name || 'Cliente Anónimo',
        clientDni: clientData?.dni || '',
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalAmount,
        pharmacistName: pharmacistData?.full_name || 'Sistema',
        branchName: 'Principal', // Puedes obtenerlo de branches si lo usas
        branchAddress: 'Av. Principal 123',
        branchPhone: '(01) 234-5678',
        paymentStatus: isCredit ? 'credit' : 'paid',
      };

      // 8. Mostrar modal del comprobante
      setVoucherData(voucher);
      setIsVoucherModalOpen(true);

      // 9. Limpiar el carrito y actualizar productos
      showToast('¡Venta registrada con éxito!');
      setCart([]);
      setSelectedClient('');
      setIsCredit(false);
      setAmountPaid('');
      
      const { data: productsData } = await supabase.from('products').select('*');
      setProducts(productsData);

    } catch (error) {
      showToast(error.message, 'error');
      console.error('Error al finalizar venta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
      
      {/* Modal de Comprobante */}
      <VoucherModal 
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        voucherData={voucherData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Productos */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Nueva Venta</h1>
          
          {/* Buscador con diseño mejorado */}
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Buscar producto por nombre..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200"
            />
          </div>

          {/* Grid de productos mejorado */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {loading && <p className="col-span-full text-center py-8 text-gray-500">Cargando productos...</p>}
            {filteredProducts.map(product => (
              <button 
                key={product.id} 
                onClick={() => addToCart(product)}
                disabled={product.stock_quantity === 0}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col justify-between min-h-[120px] group"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-700 mb-2 text-sm leading-tight">{product.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-800">S/ {Number(product.price).toFixed(2)}</p>
                  <p className={`text-xs font-bold px-2 py-1 rounded-full ${
                    product.stock_quantity > 10 ? 'bg-green-100 text-green-600' : 
                    product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    Stock: {product.stock_quantity}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Carrito y Resumen */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col overflow-hidden">
          {/* Header del carrito con icono */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Resumen de Venta</h2>
            </div>
            <div className="flex justify-between items-center text-orange-100">
              <span>{cart.length} productos en el carrito</span>
              <div className="text-right">
                <div className="text-sm">Total:</div>
                <div className="text-2xl font-bold text-white">S/ {totalAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1">

            {/* Cliente */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Cliente
              </label>
              <select 
                value={selectedClient} 
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="">Cliente Anónimo</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.full_name}</option>)}
              </select>
            </div>

            {/* Items del carrito */}
            <div className="space-y-3 mb-6 max-h-[35vh] overflow-y-auto custom-scrollbar">
              {cart.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">El carrito está vacío</p>
                  <p className="text-gray-400 text-sm">Selecciona productos para comenzar</p>
                </div>
              )}
              {cart.map(item => (
                <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</p>
                      <p className="text-orange-600 font-bold">S/ {Number(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                      >
                        <MinusIcon />
                      </button>
                      <span className="font-bold text-lg w-8 text-center bg-white px-2 py-1 rounded-lg border border-gray-200">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)} 
                        className="bg-green-100 hover:bg-green-200 text-green-600 p-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between font-bold text-xl text-gray-800">
                <span>TOTAL:</span>
                <span className="text-orange-600">S/ {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Campo de pago */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Paga con (S/):
              </label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-right font-semibold text-lg transition-all duration-200"
              />
            </div>

            {/* Vuelto */}
            {changeAmount > 0 && (
              <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span className="font-bold text-green-700">Vuelto:</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">S/ {changeAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Toggle crédito */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <label htmlFor="creditToggle" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  Venta a Crédito
                </label>
                <div className="relative inline-block w-12 h-6">
                  <input 
                    type="checkbox" 
                    name="creditToggle" 
                    id="creditToggle" 
                    checked={isCredit}
                    onChange={() => setIsCredit(!isCredit)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 appearance-none cursor-pointer shadow-sm transition-all duration-200"
                  />
                  <label 
                    htmlFor="creditToggle" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200"
                  ></label>
                </div>
              </div>
            </div>

            {/* Botón finalizar */}
            <button 
              onClick={handleFinalizeSale}
              disabled={loading || cart.length === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Finalizar Venta
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #F97316;
          transform: translateX(100%);
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #F97316;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}