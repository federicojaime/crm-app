import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconEdit, 
  IconLock, 
  IconTrash, 
  IconSearch,
  IconPlus
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import AddUserModal from '../components/modals/AddUserModal';

const UsersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Datos de ejemplo
  const [users, setUsers] = useState([
    {
      id: 1,
      initials: 'JP',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@example.com',
      telefono: '+5491123456789',
      rol: 'SUPER ADMINISTRADOR',
      estado: 'ACTIVO',
      fechaCreacion: '2024-06-10',
    },
    {
      id: 2,
      initials: 'MG',
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@example.com',
      telefono: '+5491187654321',
      rol: 'DISTRIBUIDOR',
      estado: 'ACTIVO',
      fechaCreacion: '2024-06-12',
    },
    {
      id: 3,
      initials: 'CR',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      email: 'carlos.rodriguez@example.com',
      telefono: '+5491156789012',
      rol: 'EMPRENDEDOR',
      estado: 'INACTIVO',
      fechaCreacion: '2024-06-15',
    },
    {
      id: 4,
      initials: 'LS',
      nombre: 'Laura',
      apellido: 'Sánchez',
      email: 'laura.sanchez@example.com',
      telefono: '+5491190123456',
      rol: 'ASISTENTE COMERCIAL',
      estado: 'ACTIVO',
      fechaCreacion: '2024-06-18',
    },
  ]);

  const handleAddUser = (userData) => {
    const initials = `${userData.nombre[0]}${userData.apellido[0]}`;
    const newUser = {
      id: users.length + 1,
      initials,
      ...userData,
      fechaCreacion: new Date().toISOString().split('T')[0],
      estado: 'ACTIVO',
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (userData) => {
    const updatedUsers = users.map(user => 
      user.id === userData.id ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    }
  };

  const handleToggleStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { 
        ...user, 
        estado: user.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' 
      } : user
    );
    setUsers(updatedUsers);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsAddModalOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const searchMatch = 
      `${user.nombre} ${user.apellido} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const roleMatch = filterRole ? user.rol === filterRole : true;
    
    return searchMatch && roleMatch;
  });

  const getRoleBadgeColor = (role) => {
    const colors = {
      'SUPER ADMINISTRADOR': 'bg-red-500',
      'DISTRIBUIDOR': 'bg-blue-500',
      'EMPRENDEDOR': 'bg-green-500',
      'ASISTENTE COMERCIAL': 'bg-violet-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'ACTIVO' ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            <IconPlus size={18} />
            Agregar Usuario
          </button>
        </div>

        <div className="mb-4 flex justify-between">
          <div className="relative w-full max-w-xl">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded"
            />
          </div>
          <button
            onClick={() => setFilterRole(filterRole ? '' : 'DISTRIBUIDOR')}
            className="ml-4 px-4 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
          >
            Filtrar por Rol
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white uppercase text-sm">
                <th className="w-16 px-4 py-3 text-left">NOMBRE</th>
                <th className="px-4 py-3 text-left">EMAIL</th>
                <th className="px-4 py-3 text-left">TELÉFONO</th>
                <th className="px-4 py-3 text-left">ROL</th>
                <th className="px-4 py-3 text-left">ESTADO</th>
                <th className="px-4 py-3 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-500 text-sm font-medium">
                          {user.initials}
                        </span>
                      </div>
                      <span>{user.nombre} {user.apellido}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-blue-600">{user.email}</td>
                  <td className="px-4 py-3">{user.telefono}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full text-white ${getRoleBadgeColor(user.rol)}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusBadgeColor(user.estado)}`}>
                      {user.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditUser(user)}
                      >
                        <IconEdit size={18} />
                      </button>
                      <button 
                        className={user.estado === 'ACTIVO' ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        <IconLock size={18} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AddUserModal
        opened={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUser(null);
        }}
        onSave={editingUser ? handleUpdateUser : handleAddUser}
        initialValues={editingUser}
      />
    </div>
  );
};

export default UsersPage;