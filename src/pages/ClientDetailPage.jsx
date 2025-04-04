import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    X,
    ChevronLeft,
    Settings,
    MessageSquare,
    Mail,
    Phone,
    Users,
    FileText,
    MapPin,
    MessageCircle  
} from 'lucide-react';

const ClientDetailSidebar = ({ isOpen, onClose, client }) => {
    const quickActions = [
        { icon: MessageSquare, label: 'Nota' },
        { icon: Mail, label: 'Correo' },
        { icon: Phone, label: 'Llamada' },
        { icon: Users, label: 'Reunión' },
        { icon: FileText, label: 'Tarea' },
        { icon: MessageCircle , label: 'Whatsapp' }
    ];
 
    const tabs = [
        { id: 'description', label: 'Descripción' },
        { id: 'activities', label: 'Actividades' }
    ];

    const [activeTab, setActiveTab] = React.useState('description');

    if (!client) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop oscuro */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                    
                    {/* Panel lateral */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed right-0 top-0 h-full w-[800px] bg-white shadow-xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between px-6 py-4 border-b">
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <ChevronLeft size={20} />
                                <span>Volver a Clientes</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        {/* Contenido con scroll */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6">
                                {/* Info del cliente */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-medium text-blue-600">
                                                {client.nombre[0]}{client.apellido[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">
                                                {client.nombre} {client.apellido}
                                            </h1>
                                            <div className="mt-1 text-sm text-gray-500">{client.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-sm rounded-full border ${
                                            client.estado === 'Activo'
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {client.estado}
                                        </span>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                                            <Settings size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Acciones rápidas */}
                                <div className="bg-gray-50 rounded-lg mb-6">
                                    <div className="flex gap-2 p-4">
                                        {quickActions.map((action) => (
                                            <button
                                                key={action.label}
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 rounded-md transition-colors"
                                            >
                                                <action.icon size={16} />
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="border-b">
                                    <nav className="flex gap-6">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                                                    activeTab === tab.id
                                                        ? 'text-blue-600'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                {tab.label}
                                                {activeTab === tab.id && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Contenido de los tabs */}
                                <div className="mt-6">
                                    {activeTab === 'description' ? (
                                        <div className="space-y-6">
                                            {/* Aspectos destacados */}
                                            <section>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                    Aspectos destacados
                                                </h3>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-gray-500">FECHA DE CREACIÓN</span>
                                                        <span className="text-sm">
                                                            {format(new Date(client.fecha_creacion), 'PPP', { locale: es })}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-gray-500">ÚLTIMO CONTACTO</span>
                                                        <span className="text-sm">
                                                            {format(new Date(client.lastContact), 'PPP', { locale: es })}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-gray-500">ORIGEN</span>
                                                        <span className="text-sm">{client.source}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-gray-500">ETAPA</span>
                                                        <span className="text-sm">{client.etapa}</span>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Información de contacto */}
                                            <section>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                    Información de contacto
                                                </h3>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="flex items-start gap-3">
                                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email</p>
                                                            <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                                                                {client.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Teléfono</p>
                                                            <a href={`tel:${client.telefono}`} className="text-gray-900">
                                                                {client.telefono}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Dirección</p>
                                                            <p className="text-gray-900">{client.direccion}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No hay actividades registradas</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default ClientDetailSidebar;