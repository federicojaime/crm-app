import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { IconX, IconLock, IconAt, IconPhone, IconUser } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

// Updated user roles
const userRoles = [
  { value: 'SUPER_ADMIN', label: '1. Super Administrador' },
  { value: 'DISTRIBUIDOR', label: '2. Distribuidor' },
  { value: 'EMPRENDEDOR', label: '3. Emprendedor' },
  { 
    value: 'ASISTENTE', 
    label: '4. Asistente', 
    subRoles: [
      { value: 'ASISTENTE_RRHH', label: 'RRHH' },
      { value: 'ASISTENTE_COMERCIAL', label: 'Comercial' },
      { value: 'ASISTENTE_ADMINISTRATIVO', label: 'Administrativo' }
    ]
  }
];

const AddUserModal = ({ opened, onClose, onSave, initialValues }) => {
  const isEditMode = !!initialValues;

  const form = useForm({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      password: '',
      confirmarPassword: '',
      rol: '',
      ...initialValues,
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      apellido: (value) => (!value ? 'El apellido es requerido' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      telefono: (value) => (!value ? 'El teléfono es requerido' : null),
      password: (value) => (
        isEditMode 
          ? null 
          : (!value 
            ? 'La contraseña es requerida' 
            : value.length < 6 
              ? 'La contraseña debe tener al menos 6 caracteres' 
              : null)
      ),
      confirmarPassword: (value, values) => (
        isEditMode 
          ? null 
          : (!value 
            ? 'Confirme la contraseña' 
            : value !== values.password 
              ? 'Las contraseñas no coinciden' 
              : null)
      ),
      rol: (value) => (!value ? 'Seleccione un rol' : null),
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues({
        ...initialValues,
        password: '',
        confirmarPassword: '',
      });
    } else {
      form.reset();
    }
  }, [initialValues, opened]);

  const handleSubmit = (values) => {
    // Eliminamos la confirmación de contraseña antes de enviar
    const userData = { ...values };
    delete userData.confirmarPassword;

    // Si estamos editando y no se cambió la contraseña, la eliminamos para no enviarla vacía
    if (isEditMode && !userData.password) {
      delete userData.password;
    }

    onSave(userData);
    onClose();
  };

  const getRoleDescription = (role) => {
    switch(role) {
      case 'SUPER ADMINISTRADOR':
        return 'Acceso completo a todas las funciones del sistema';
      case 'DISTRIBUIDOR':
        return 'Gestión de ventas, clientes y seguimiento comercial';
      case 'EMPRENDEDOR':
        return 'Registro de ventas y gestión limitada de clientes';
      case 'ASISTENTE COMERCIAL':
        return 'Registro de actividades y soporte sin acceso a reportes';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {opened && (
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
                <IconX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  form.onSubmit(handleSubmit)();
                }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconUser size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className={`w-full pl-10 pr-3 py-2 border ${form.errors.nombre ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                            placeholder="Nombre"
                            {...form.getInputProps('nombre')}
                          />
                        </div>
                        {form.errors.nombre && (
                          <p className="mt-1 text-sm text-red-500">{form.errors.nombre}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border ${form.errors.apellido ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                          placeholder="Apellido"
                          {...form.getInputProps('apellido')}
                        />
                        {form.errors.apellido && (
                          <p className="mt-1 text-sm text-red-500">{form.errors.apellido}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IconAt size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          className={`w-full pl-10 pr-3 py-2 border ${form.errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                          placeholder="email@ejemplo.com"
                          {...form.getInputProps('email')}
                        />
                      </div>
                      {form.errors.email && (
                        <p className="mt-1 text-sm text-red-500">{form.errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IconPhone size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className={`w-full pl-10 pr-3 py-2 border ${form.errors.telefono ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                          placeholder="+54 9 11 1234-5678"
                          {...form.getInputProps('telefono')}
                        />
                      </div>
                      {form.errors.telefono && (
                        <p className="mt-1 text-sm text-red-500">{form.errors.telefono}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <select
                        className={`w-full px-3 py-2 border ${form.errors.rol ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                        {...form.getInputProps('rol')}
                      >
                        <option value="">Seleccione un rol</option>
                        {userRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {form.errors.rol && (
                        <p className="mt-1 text-sm text-red-500">{form.errors.rol}</p>
                      )}
                    </div>

                    {form.values.rol && (
                      <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                        <p className="font-medium">Permisos: {form.values.rol}</p>
                        <p className="mt-1">{getRoleDescription(form.values.rol)}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Credenciales de acceso</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isEditMode ? "Nueva Contraseña (dejar en blanco para mantener la actual)" : "Contraseña"}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconLock size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            className={`w-full pl-10 pr-3 py-2 border ${form.errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                            placeholder={isEditMode ? "Nueva contraseña" : "Ingrese contraseña"}
                            {...form.getInputProps('password')}
                          />
                        </div>
                        {form.errors.password && (
                          <p className="mt-1 text-sm text-red-500">{form.errors.password}</p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconLock size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            className={`w-full pl-10 pr-3 py-2 border ${form.errors.confirmarPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                            placeholder="Confirme la contraseña"
                            {...form.getInputProps('confirmarPassword')}
                          />
                        </div>
                        {form.errors.confirmarPassword && (
                          <p className="mt-1 text-sm text-red-500">{form.errors.confirmarPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={form.onSubmit(handleSubmit)}
                  className="px-4 py-2 bg-blue-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-600"
                >
                  {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;