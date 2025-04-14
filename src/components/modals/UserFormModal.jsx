// src/components/modals/UserFormModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, At, Lock, Check, AlertCircle } from 'lucide-react';
import UserService from '../../services/UserService';
import AuthService from '../../services/AuthService';

// Límite máximo de usuarios permitidos
const USER_LIMIT = 10;

const UserFormModal = ({ isOpen, onClose, initialValues = null, onSaved, currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [roles, setRoles] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    roles: []
  });

  const isEditMode = !!initialValues;
  const isSuperAdmin = currentUser?.roles?.some(role => role.name === 'SUPER_ADMIN');

  // Cargar roles disponibles y contar usuarios
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Cargar roles disponibles
        const availableRoles = await AuthService.getAllRoles();
        setRoles(availableRoles || []);
        
        // Obtener conteo de usuarios
        const users = await UserService.getAllUsers();
        setUserCount(users?.length || 0);
        
        // Verificar si se excedió el límite
        if (!isEditMode && users?.length >= USER_LIMIT) {
          setWarning(`Has alcanzado el límite máximo de ${USER_LIMIT} usuarios. No puedes crear más usuarios.`);
        } else {
          setWarning('');
        }
        
        // Verificar permisos de creación
        if (!isEditMode && !isSuperAdmin) {
          setError('Solo los administradores pueden crear nuevos usuarios.');
        } else {
          setError('');
        }
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
        setError('No se pudieron cargar los datos necesarios');
      }
    }

    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen, isEditMode, isSuperAdmin]);

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
    // Validación de permisos
    if (!isEditMode && !isSuperAdmin) {
      return 'No tienes permisos para crear nuevos usuarios';
    }
    
    // Validación de límite de usuarios
    if (!isEditMode && userCount >= USER_LIMIT) {
      return `Se ha excedido el límite de ${USER_LIMIT} usuarios en el sistema`;
    }
    
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
                {/* Advertencia de límite de usuarios */}
                {warning && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-700 flex items-start">
                    <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                )}

                {/* Error de validación o permisos */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-700 flex items-start">
                    <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Mensaje de información sobre permisos */}
                {!isEditMode && !isSuperAdmin && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700 flex items-start">
                    <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>Solo los usuarios con rol de Super Administrador pueden crear nuevos usuarios.</span>
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
                      disabled={!isEditMode && (!isSuperAdmin || userCount >= USER_LIMIT)}
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
                        disabled={!isEditMode && (!isSuperAdmin || userCount >= USER_LIMIT)}
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
                        disabled={!isEditMode && (!isSuperAdmin || userCount >= USER_LIMIT)}
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
                      disabled={!isEditMode && (!isSuperAdmin || userCount >= USER_LIMIT)}
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
                            ${!isEditMode && (!isSuperAdmin || userCount >= USER_LIMIT) ? 'opacity-50 pointer-events-none' : ''}
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
                  disabled={isLoading || (!isEditMode && (!isSuperAdmin || userCount >= USER_LIMIT))}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium flex items-center
                    ${(!isEditMode && (!isSuperAdmin || userCount >= USER_LIMIT))
                      ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
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