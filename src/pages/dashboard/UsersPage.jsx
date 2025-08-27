// src/pages/dashboard/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

// --- Iconos ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

// --- Componentes Modales y de Notificación ---
const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Farmacéutico');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => { setFullName(''); setEmail(''); setPassword(''); setRole('Farmacéutico'); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('create-user', { body: { email, password, fullName, role } });
      if (invokeError) throw invokeError;
      if (data.error) throw new Error(data.error);
      onUserAdded('Usuario creado con éxito');
      resetForm();
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
        <h2 className="text-2xl font-bold mb-6">Añadir Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Nombre Completo</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required /></div>
          <div><label className="block text-sm font-medium text-gray-700">Correo Electrónico</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required /></div>
          <div><label className="block text-sm font-medium text-gray-700">Contraseña</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required /></div>
          <div><label className="block text-sm font-medium text-gray-700">Rol</label><select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"><option>Farmacéutico</option><option>Administrador</option></select></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button><button type="submit" disabled={loading} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50">{loading ? 'Creando...' : 'Crear Usuario'}</button></div>
        </form>
      </div>
    </div>
  );
};

const EditUserModal = ({ isOpen, onClose, onUserUpdated, userToEdit }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Farmacéutico');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFullName(userToEdit.full_name);
      setRole(userToEdit.role);
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName, role: role }).eq('id', userToEdit.id);
      if (error) throw error;
      onUserUpdated('Usuario actualizado con éxito');
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
        <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Nombre Completo</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required /></div>
          <div><label className="block text-sm font-medium text-gray-700">Rol</label><select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"><option>Farmacéutico</option><option>Administrador</option></select></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button><button type="submit" disabled={loading} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50">{loading ? 'Guardando...' : 'Guardar Cambios'}</button></div>
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
        <div className="flex justify-center gap-4"><button onClick={onClose} disabled={loading} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50">Cancelar</button><button onClick={onConfirm} disabled={loading} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50">{loading ? 'Eliminando...' : 'Confirmar'}</button></div>
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

export default function UsersPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchProfiles = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
      if (error) throw error;
      setProfiles(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfiles();
  }, []);

  const handleEdit = (profile) => {
    setCurrentUser(profile);
    setIsEditModalOpen(true);
  };

  const handleDelete = (profile) => {
    setCurrentUser(profile);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentUser) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user', { body: { userId: currentUser.id } });
      if (error) throw error;

      setTimeout(() => {
        fetchProfiles();
        showToast('Usuario eliminado con éxito');
        setIsDeleteModalOpen(false);
        setIsDeleting(false);
      }, 500);

    } catch (error) {
      showToast(error.message, 'error');
      setIsDeleting(false);
    }
  };

  return (
    <>
      {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onUserAdded={(message) => { fetchProfiles(); showToast(message); }} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onUserUpdated={(message) => { fetchProfiles(); showToast(message); }} userToEdit={currentUser} />
      <ConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete}
        message={`¿Seguro que quieres eliminar a ${currentUser?.full_name}?`}
        loading={isDeleting}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          + Añadir Usuario
        </button>
      </div>

      {loading ? ( <p className="text-gray-600">Cargando usuarios...</p> ) : error ? ( <p className="text-red-500">Error: {error}</p> ) : (
        <div>
          {/* Vista de Tabla para Desktop */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre Completo</th>
                  <th scope="col" className="px-6 py-3">Rol</th>
                  <th scope="col" className="px-6 py-3">Miembro Desde</th>
                  <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="border-b hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{profile.full_name}</td>
                    <td className="px-6 py-4">{profile.role}</td>
                    <td className="px-6 py-4">{new Date(profile.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(profile)} className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors" title="Editar"><EditIcon /></button>
                        <button onClick={() => handleDelete(profile)} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors" title="Eliminar"><DeleteIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de Tarjetas para Móvil */}
          <div className="block md:hidden space-y-4">
            {profiles.map(profile => (
              <div key={profile.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{profile.full_name}</p>
                    <p className="text-sm font-semibold text-orange-500">{profile.role}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEdit(profile)} className="p-2 text-blue-600 bg-blue-100 rounded-full"><EditIcon /></button>
                    <button onClick={() => handleDelete(profile)} className="p-2 text-red-600 bg-red-100 rounded-full"><DeleteIcon /></button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Miembro Desde</p>
                  <p className="font-semibold text-gray-700">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}