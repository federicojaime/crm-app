// src/components/modals/UserFormModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, At, Phone, Lock, Check } from 'lucide-react';
import UserService from '../../services/UserService';
import AuthService from '../../services/AuthService';

const UserFormModal = ({ isOpen, onClose, initialValues = null, onSaved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    roles: []
  });

  const isEditMode = !!initialValues;

  // Cargar roles disponibles
  useEffect(() => {
    async function loadRoles() {
      try {
        const availableRoles = await AuthService.getAllRoles();
        setRoles(availableRoles || []);
      } catch (err) {
        console.error('Error al cargar roles:', err);
        setError('No se pudieron cargar los roles disponibles');
      }
    }

    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  // Inicializar formulario con valores cuando estamos en modo edición
  useEffect(() => {
    if (initialValues) {
      setFormData({
        id: initialValues.id,
        email: initialValues.email || '',
        firstname: initialValues.firstname || '',
        lastname: initialValues.lastname || '',
        password: '', // No mostramos la contraseña actual por seguridad
        roles: initialValues.roles?.map(r => r.id) || []
      });
    } else {
      // Resetear formulario para un nuevo usuario
      setFormData({
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        roles: []
      });
    }
  }, [initialValues, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleRole = (roleId) => {
    setFormData(prev => {
      const currentRoles = [...prev.roles];
      if (currentRoles.includes(roleId)) {
        return { ...prev, roles: currentRoles.filter(id => id !== roleId) };
      } else {
        return { ...prev, roles: [...currentRoles, roleId] };
      }
    });
  };

  const validateForm = () => {
    // Validaciones básicas
    if (!formData.email) return 'El email es requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'El email no es válido';
    if (!formData.firstname) return 'El nombre es requerido';
    if (!formData.lastname) return 'El apellido es requerido';
    if (!isEditMode && !formData.password) return 'La contraseña es requerida';
    if (formData.password && formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (formData.roles.length === 0) return 'Debe seleccionar al menos un rol';
    
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      let response;
      if (isEditMode) {
        // Actualizar usuario existente
        response = await UserService.updateUser(formData.id, formData);
      } else {
        // Crear nuevo usuario
        response = await UserService.createUser(formData);
      }

      // Si tiene ID y se debe asignar roles
      if (isEditMode || (response && response.data && response.data.newId)) {
        const userId = isEditMode ? formData.id : response.data.newId;
        
        // Asignar roles al usuario
        await AuthService.assignRolesToUser(userId, formData.roles);
      }

      // Notificar al componente padre
      if (onSaved) {
        onSaved(formData);
      }
      
      onClose();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError(typeof err === 'string' ? err : 'Error al guardar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 overflow-hidden flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-700">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <At size={16} className="mr-2 text-blue-600" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <User size={16} className="mr-2 text-blue-600" />
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Apellido"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Lock size={16} className="mr-2 text-blue-600" />
                      {isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={isEditMode ? "Dejar en blanco para mantener la actual" : "Contraseña"}
                      required={!isEditMode}
                    />
                    {isEditMode && (
                      <p className="text-sm text-gray-500 mt-1">
                        Dejar en blanco para mantener la contraseña actual
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Roles
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {roles.map((role) => (
                        <div 
                          key={role.id}
                          className={`
                            px-3 py-2 rounded-lg text-sm cursor-pointer transition-all
                            ${formData.roles.includes(role.id) 
                              ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' 
                              : 'bg-gray-50 border border-gray-200 hover:border-blue-200'}
                          `}
                          onClick={() => toggleRole(role.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{role.name}</span>
                            {formData.roles.includes(role.id) && (
                              <Check size={16} className="text-blue-600" />
                            )}
                          </div>
                          {role.description && (
                            <p className="text-xs mt-1 text-gray-500">{role.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    {roles.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No se pudieron cargar los roles disponibles
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;