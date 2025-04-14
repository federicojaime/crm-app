import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Mail,
    Phone,
    Calendar,
    AlertCircle,
    LayoutGrid,
    List,
    Table2,
    ChevronDown,
    ChevronUp,
    FileSpreadsheet,
    UserPlus,
    Upload,
    Download,
} from 'lucide-react';
import AddClientModal from '../components/modals/AddClientModal';
import ClientDetailSidebar from './ClientDetailPage';
import SyncContactsModal from '../components/modals/SyncContactsModal';

const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'status', label: 'Estado' },
    { key: 'source', label: 'Fuente' },
    { key: 'lastContact', label: 'Último Contacto' }
];

const ClientStatusBadge = ({ status }) => {
    const styles = {
        Activo: 'bg-green-100 text-green-700 border-green-200',
        Inactivo: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
        <span className={`px-2 py-1 text-sm rounded-full border ${styles[status]}`}>
            {status}
        </span>
    );
};

const ClientSourceBadge = ({ source }) => {
    const styles = {
        'Recomendación': 'bg-purple-100 text-purple-700',
        'Sitio Web': 'bg-blue-100 text-blue-700',
        'Evento': 'bg-yellow-100 text-yellow-700',
        'Redes Sociales': 'bg-pink-100 text-pink-700',
        'Publicidad': 'bg-orange-100 text-orange-700',
        'Google Contacts': 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-2 py-1 text-sm rounded-lg ${styles[source] || 'bg-gray-100 text-gray-700'}`}>
            {source}
        </span>
    );
};

const TableHeader = ({ column, onSort, filters, onFilter, sorting }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [filterSearch, setFilterSearch] = useState('');

    const handleClickOutside = (e) => {
        if (!e.target.closest('.filter-dropdown')) {
            setShowFilter(false);
        }
    };

    useEffect(() => {
        if (showFilter) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilter]);

    const filteredValues = filters.filter(value =>
        String(value).toLowerCase().includes(filterSearch.toLowerCase())
    );

    return (
        <th className="px-4 py-3 bg-[#508ecb] text-white border-b border-r border-gray-300 relative">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSort(column.key)}>
                    <span className="text-xs font-medium uppercase whitespace-nowrap">
                        {column.label}
                    </span>
                    {sorting.field === column.key && (
                        <span>
                            {sorting.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFilter(!showFilter);
                    }}
                    className="p-1 hover:bg-[#3e78a5] rounded"
                >
                    <Filter size={14} className="text-white" />
                </button>
            </div>
            {showFilter && (
                <div className="filter-dropdown absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-gray-700"
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredValues.map((value, index) => (
                            <label
                                key={index}
                                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                            >
                                <input
                                    type="checkbox"
                                    className="mr-2 rounded border-gray-300"
                                    checked={column.selectedFilters?.includes(value)}
                                    onChange={() => onFilter(column.key, value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-sm text-gray-700">{value || '--'}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </th>
    );
};

const ClientCard = ({ client, onClientClick }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3
                    onClick={() => onClientClick(client.id)}
                    className="text-lg font-semibold text-[#508ecb] hover:underline cursor-pointer"
                >
                    {client.nombre} {client.apellido}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Mail size={16} />
                    <a href={`mailto:${client.email}`} className="hover:text-[#508ecb]">
                        {client.email}
                    </a>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Phone size={16} />
                    <a href={`tel:${client.telefono}`} className="hover:text-[#508ecb]">
                        {client.telefono}
                    </a>
                </div>
            </div>
            <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                    <MoreVertical size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                        <Edit2 size={16} />
                        Editar
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600">
                        <Trash2 size={16} />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
            <ClientStatusBadge status={client.estado} />
            <ClientSourceBadge source={client.source} />
        </div>

        <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
            <Calendar size={16} />
            <span>Último contacto: {format(new Date(client.lastContact), 'PPP', { locale: es })}</span>
        </div>
    </motion.div>
);

const ClientListItem = ({ client, onClientClick }) => (
    <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-[#508ecb] font-medium">
                        {`${client.nombre[0]}${client.apellido[0]}`}
                    </span>
                </div>
                <div>
                    <h3
                        onClick={() => onClientClick(client.id)}
                        className="font-medium text-[#508ecb] hover:underline cursor-pointer"
                    >
                        {client.nombre} {client.apellido}
                    </h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <ClientStatusBadge status={client.estado} />
                <ClientSourceBadge source={client.source} />
                <div className="relative group">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                        <MoreVertical size={20} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                            <Edit2 size={16} />
                            Editar
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600">
                            <Trash2 size={16} />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const ClientsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('table');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const clientsPerPage = 5;
    const [sorting, setSorting] = useState({ field: null, direction: 'asc' });
    const [columnFilters, setColumnFilters] = useState({});

    // Datos de ejemplo
    const [clients, setClients] = useState([
        {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juanperez@example.com',
            telefono: '+5491123456789',
            direccion: 'Buenos Aires, Argentina',
            estado: 'Activo',
            source: 'Recomendación',
            lastContact: '2024-01-15',
            fecha_creacion: '2024-01-10',
            etapa: 'Prospecto',
        },
        {
            id: 2,
            nombre: 'María',
            apellido: 'López',
            email: 'marialopez@example.com',
            telefono: '+5491187654321',
            direccion: 'Córdoba, Argentina',
            estado: 'Inactivo',
            source: 'Sitio Web',
            lastContact: '2024-02-10',
            fecha_creacion: '2024-02-01',
            etapa: 'Lead',
        },
        {
            id: 3,
            nombre: 'Carlos',
            apellido: 'García',
            email: 'carlosgarcia@example.com',
            telefono: '+5491133344556',
            direccion: 'Rosario, Argentina',
            estado: 'Activo',
            source: 'Evento',
            lastContact: '2024-03-05',
            fecha_creacion: '2024-03-01',
            etapa: 'Prospecto',
        },
        {
            id: 4,
            nombre: 'Ana',
            apellido: 'Fernández',
            email: 'anafernandez@example.com',
            telefono: '+5491177788899',
            direccion: 'Mendoza, Argentina',
            estado: 'Activo',
            source: 'Redes Sociales',
            lastContact: '2024-03-20',
            fecha_creacion: '2024-03-10',
            etapa: 'Lead',
        },
        {
            id: 5,
            nombre: 'Luis',
            apellido: 'Martínez',
            email: 'luismartinez@example.com',
            telefono: '+5491166677788',
            direccion: 'Salta, Argentina',
            estado: 'Inactivo',
            source: 'Publicidad',
            lastContact: '2024-04-25',
            fecha_creacion: '2024-04-15',
            etapa: 'Cliente',
        },
        {
            id: 6,
            nombre: 'Sofía',
            apellido: 'González',
            email: 'sofiagonzalez@example.com',
            telefono: '+5491144455566',
            direccion: 'Neuquén, Argentina',
            estado: 'Activo',
            source: 'Recomendación',
            lastContact: '2024-05-10',
            fecha_creacion: '2024-04-20',
            etapa: 'Prospecto',
        },
        {
            id: 7,
            nombre: 'Ricardo',
            apellido: 'Domínguez',
            email: 'ricardodominguez@example.com',
            telefono: '+5491155533442',
            direccion: 'Chaco, Argentina',
            estado: 'Inactivo',
            source: 'Evento',
            lastContact: '2024-05-15',
            fecha_creacion: '2024-05-01',
            etapa: 'Cliente',
        },
        {
            id: 8,
            nombre: 'Laura',
            apellido: 'Ramírez',
            email: 'lauraramirez@example.com',
            telefono: '+5491132234455',
            direccion: 'San Juan, Argentina',
            estado: 'Activo',
            source: 'Publicidad',
            lastContact: '2024-06-01',
            fecha_creacion: '2024-05-20',
            etapa: 'Prospecto',
        },
        {
            id: 9,
            nombre: 'Pedro',
            apellido: 'Sánchez',
            email: 'pedrosanchez@example.com',
            telefono: '+5491144223388',
            direccion: 'Tucumán, Argentina',
            estado: 'Activo',
            source: 'Sitio Web',
            lastContact: '2024-06-10',
            fecha_creacion: '2024-06-01',
            etapa: 'Lead',
        },
        {
            id: 10,
            nombre: 'Valentina',
            apellido: 'Rojas',
            email: 'valentinarojas@example.com',
            telefono: '+5491155667788',
            direccion: 'Misiones, Argentina',
            estado: 'Inactivo',
            source: 'Recomendación',
            lastContact: '2024-06-15',
            fecha_creacion: '2024-06-05',
            etapa: 'Cliente',
        },
    ]);


    const selectedClient = useMemo(() => {
        if (!id) return null;
        return clients.find(client => client.id === parseInt(id));
    }, [id, clients]);

    const handleClientClick = (clientId) => {
        navigate(`/clients/${clientId}`, { state: { background: location } });
    };

    const handleCloseDetail = () => {
        navigate('/clients');
    };

    // Función para manejar la importación de contactos desde Google
    const handleImportedContacts = (importedContacts) => {
        // Añadir los contactos importados a la lista de clientes
        // Asegurarse de no duplicar contactos que ya existen (basado en email)
        const existingEmails = new Set(clients.map(client => client.email.toLowerCase()));

        const newContacts = importedContacts.filter(contact =>
            !existingEmails.has(contact.email.toLowerCase())
        );

        // Asignar nuevos IDs para evitar conflictos
        const maxId = Math.max(...clients.map(client => client.id), 0);
        const contactsWithIds = newContacts.map((contact, index) => ({
            ...contact,
            id: maxId + index + 1
        }));

        setClients(prevClients => [...prevClients, ...contactsWithIds]);
    };

    // Función para obtener valores únicos para los filtros
    const getUniqueValues = (key) => {
        return [...new Set(clients.map(client => client[key] || '--'))].sort();
    };

    // Funciones de ordenamiento y filtrado
    const handleSort = (field) => {
        setSorting(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilter = (key, value) => {
        setColumnFilters(prev => {
            const currentFilters = prev[key] || [];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter(v => v !== value)
                : [...currentFilters, value];

            return {
                ...prev,
                [key]: newFilters
            };
        });
        setCurrentPage(1);
    };

      // Datos filtrados y ordenados
      const filteredClients = useMemo(() => {
        let result = [...clients];

        // Aplicar búsqueda primero para mejorar la experiencia del usuario
        if (search.trim()) {
            const searchLower = search.toLowerCase().trim();
            result = result.filter(client => {
                // Buscar en múltiples campos y mejorar la lógica de búsqueda
                const fullName = `${client.nombre} ${client.apellido}`.toLowerCase();
                const emailLower = (client.email || '').toLowerCase();
                const phoneStr = (client.telefono || '').toString();
                const companyLower = (client.empresa || '').toLowerCase();
                
                return fullName.includes(searchLower) || 
                       emailLower.includes(searchLower) || 
                       phoneStr.includes(searchLower) ||
                       companyLower.includes(searchLower);
            });
        }

        // Aplicar filtros de columnas
        Object.entries(columnFilters).forEach(([key, values]) => {
            if (values && values.length > 0) {
                result = result.filter(client => {
                    // Mejorar el manejo de valores nulos o indefinidos
                    const clientValue = client[key] || '--';
                    return values.includes(clientValue);
                });
            }
        });

        // Aplicar ordenamiento
        if (sorting.field) {
            result.sort((a, b) => {
                let aValue = a[sorting.field] || '';
                let bValue = b[sorting.field] || '';

                // Manejo especial para campos de fecha
                if (['lastContact', 'fecha_creacion'].includes(sorting.field)) {
                    const dateA = new Date(aValue);
                    const dateB = new Date(bValue);
                    return sorting.direction === 'asc' 
                        ? dateA - dateB 
                        : dateB - dateA;
                }

                // Ordenamiento de texto estándar
                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (sorting.direction === 'asc') {
                    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                } else {
                    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                }
            });
        }

        return result;
    }, [clients, columnFilters, search, sorting]);

    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
    const currentClients = filteredClients.slice(
        (currentPage - 1) * clientsPerPage,
        currentPage * clientsPerPage
    );

    const mockData = {
        availableUsers: [
            { value: 'user1', label: 'Juan Pérez' },
            { value: 'user2', label: 'María García' },
            { value: 'user3', label: 'Carlos López' },
        ],
        availableStates: [
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'contactado', label: 'Contactado' },
        ],
        availableTags: [
            { value: 'vip', label: 'VIP' },
            { value: 'nuevo', label: 'Nuevo Cliente' },
            { value: 'potencial', label: 'Cliente Potencial' },
            { value: 'recurrente', label: 'Cliente Recurrente' },
            { value: 'referido', label: 'Referido' },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>

                    <div className="flex gap-2">
                        {/* Botón para importar/sincronizar contactos */}
                        <button
                            onClick={() => setIsSyncModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Upload size={18} />
                            Importar Contactos
                        </button>

                        {/* Botón para añadir un contacto manualmente */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#508ecb] text-white rounded-lg hover:bg-[#3e78a5] transition-colors"
                        >
                            <UserPlus size={18} />
                            Crear Contacto
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar clientes por nombre, email o teléfono..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                // Resetear la página al buscar
                                setCurrentPage(1);
                            }}
                            onKeyDown={(e) => {
                                // Prevenir comportamientos inesperados en la búsqueda
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ecb] focus:border-transparent"
                        />
                        {search && (
                            <button 
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                X
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-[#508ecb] text-white' : 'hover:bg-gray-100'}`}
                        >
                            <Table2 size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#508ecb] text-white' : 'hover:bg-gray-100'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#508ecb] text-white' : 'hover:bg-gray-100'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {currentClients.length > 0 ? (
                        <>
                            {viewMode === 'table' && (
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="w-12 px-4 py-3 bg-[#508ecb] text-white border border-gray-300">
                                                        <input type="checkbox" className="rounded border-gray-300" />
                                                    </th>
                                                    {columns.map((column) => (
                                                        <TableHeader
                                                            key={column.key}
                                                            column={{ ...column, selectedFilters: columnFilters[column.key] }}
                                                            onSort={handleSort}
                                                            sorting={sorting}
                                                            filters={getUniqueValues(column.key)}
                                                            onFilter={handleFilter}
                                                        />
                                                    ))}
                                                    <th className="w-12 px-4 py-3 bg-[#508ecb] text-white border border-gray-300">
                                                        <span className="sr-only">Acciones</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentClients.map((client) => (
                                                    <tr key={client.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 border border-gray-300">
                                                            <input type="checkbox" className="rounded border-gray-300" />
                                                        </td>
                                                        <td className="px-4 py-3 border border-gray-300">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-[#508ecb] text-sm font-medium">
                                                                        {client.nombre[0]}{client.apellido[0]}
                                                                    </span>
                                                                </div>
                                                                <span
                                                                    onClick={() => handleClientClick(client.id)}
                                                                    className="font-medium text-[#508ecb] hover:underline cursor-pointer"
                                                                >
                                                                    {client.nombre} {client.apellido}
                                                                </span>
                                                            </div>
                                                        </td>
                                                       
                                                        <td className="px-4 py-3 border border-gray-300">{client.telefono}</td>
                                                        <td className="px-4 py-3 border border-gray-300">
                                                            <ClientStatusBadge status={client.estado} />
                                                        </td>
                                                        <td className="px-4 py-3 border border-gray-300">
                                                            <ClientSourceBadge source={client.source} />
                                                        </td>
                                                        <td className="px-4 py-3 border border-gray-300">
                                                            {format(new Date(client.lastContact), 'PPP', { locale: es })}
                                                        </td>
                                                        <td className="px-4 py-3 border border-gray-300">
                                                            <div className="relative group">
                                                                <button className="p-1 rounded-lg hover:bg-gray-100">
                                                                    <MoreVertical size={18} />
                                                                </button>
                                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                                                                        <Edit2 size={16} />
                                                                        Editar
                                                                    </button>
                                                                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600">
                                                                        <Trash2 size={16} />
                                                                        Eliminar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            {viewMode === 'grid' && (
                                <motion.div layout className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {currentClients.map((client) => (
                                        <ClientCard
                                            key={client.id}
                                            client={client}
                                            onClientClick={handleClientClick}
                                        />
                                    ))}
                                </motion.div>
                            )}
                            {viewMode === 'list' && (
                                <motion.div layout className="space-y-4">
                                    {currentClients.map((client) => (
                                        <ClientListItem
                                            key={client.id}
                                            client={client}
                                            onClientClick={handleClientClick}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-12"
                        >
                            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron clientes</h3>
                            <p className="mt-2 text-gray-500">Prueba ajustando los filtros de búsqueda</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {/* Modales */}
            <ClientDetailSidebar
                isOpen={!!selectedClient}
                onClose={handleCloseDetail}
                client={selectedClient}
            />

            <AddClientModal
                opened={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                availableUsers={mockData.availableUsers}
                availableStates={mockData.availableStates}
                availableTags={mockData.availableTags}
            />

            {/* Modal de Sincronización e Importación de Contactos */}
            {/* Modal de Sincronización e Importación de Contactos */}
            <SyncContactsModal
                opened={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                onContactsImported={handleImportedContacts}
                contacts={clients}
            />
        </div>
    );
};

export default ClientsPage;