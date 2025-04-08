// src/components/Sidebar.jsx - VERSIÓN CORREGIDA
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    IconDashboard,
    IconUsers,
    IconChartBar,
    IconGitPullRequest,
    IconSettings,
    IconChevronLeft,
    IconChevronRight,
    IconUserPlus, 
    IconCalendarTime,
    IconBriefcase,
    IconUserCheck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Logo from "../assets/logo_login.png";

export default function Sidebar() {
    const [expanded, setExpanded] = useState(true);
    const location = useLocation();
    const [userRole, setUserRole] = useState('');
    
    // Estado para almacenar el estado de los menús desplegables
    // Inicializamos un objeto vacío que se llenará con IDs de menú
    const [subMenuOpenState, setSubMenuOpenState] = useState({});

    // Obtener el rol del usuario del localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.rol || 'EMPRENDEDOR'); // Default a EMPRENDEDOR si no hay rol
    }, []);

    // Función para verificar si el usuario tiene acceso a un elemento del menú
    const hasAccess = (requiredRoles) => {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return requiredRoles.includes(userRole);
    };

    // Maneja el toggle del submenú
    const toggleSubMenu = (id) => {
        setSubMenuOpenState(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Verifica si un submenú está abierto
    const isSubMenuOpen = (id) => {
        return !!subMenuOpenState[id];
    };

    // Inicializar el estado de los submenús al cargar el componente
    useEffect(() => {
        const initialSubMenuState = {};
        menuItems.forEach(item => {
            if (item.subItems) {
                const hasActiveSubItem = item.subItems.some(subItem => 
                    location.pathname.startsWith(subItem.to)
                );
                initialSubMenuState[item.to] = hasActiveSubItem;
            }
        });
        setSubMenuOpenState(initialSubMenuState);
    }, [location.pathname]);

    // Definición del menú con control de acceso por rol
    const menuItems = [
        {
            icon: IconDashboard,
            label: 'Panel de Control',
            to: '/',
            roles: [], // Acceso para todos
        },
        {
            icon: IconUsers,
            label: 'Clientes',
            to: '/clients',
            roles: [], // Acceso para todos
        },
        {
            icon: IconChartBar,
            label: 'Ventas',
            to: '/sales',
            roles: [], // Acceso para todos
        },
        {
            icon: IconGitPullRequest,
            label: 'Proceso',
            to: '/pipeline',
            roles: [], // Acceso para todos
        },
        {
            icon: IconCalendarTime,
            label: 'Tareas',
            to: '/tasks',
            roles: [], // Acceso para todos
        },
        {
            icon: IconBriefcase,
            label: 'RRHH',
            to: '/rrhh',
            roles: ['SUPER ADMINISTRADOR', 'DISTRIBUIDOR', 'ASISTENTE COMERCIAL'], // No accesible para Emprendedor
        },
        {
            icon: IconSettings,
            label: 'Configuración',
            to: '/settings',
            roles: ['SUPER ADMINISTRADOR', 'DISTRIBUIDOR'],
            subItems: [
                {
                    icon: IconUserPlus,
                    label: 'Usuarios',
                    to: '/users',
                    roles: ['SUPER ADMINISTRADOR', 'DISTRIBUIDOR'],
                }
            ]
        },
    ];

    // Filtrar elementos del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(item => hasAccess(item.roles));

    return (
        <motion.div
            initial={{ width: expanded ? 280 : 80 }}
            animate={{ width: expanded ? 280 : 80 }}
            className="relative h-screen bg-white border border-black/20 py-6 px-4"
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-center mb-10 px-2">
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center w-full"
                        >
                            <img src={Logo} className='w-24' alt="Logo" />
                        </motion.div>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 rounded-full hover:bg-black/5 transition-colors absolute -right-3 top-12 bg-white shadow-md border border-black/20"
                    >
                        {expanded ?
                            <IconChevronLeft size={18} className="text-[#508ecb]" /> :
                            <IconChevronRight size={18} className="text-[#508ecb]" />
                        }
                    </button>
                </div>

                {/* Mostrar rol del usuario si está expandido */}
                {expanded && (
                    <div className="mb-4 px-4 py-2 bg-blue-50 rounded-lg text-[#508ecb] text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <IconUserCheck size={16} />
                            <span>Rol: {userRole || 'Usuario'}</span>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="space-y-1">
                    {filteredMenuItems.map((item) => {
                        const isActive = item.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.to);

                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        
                        // Filtrar subitems según rol
                        const filteredSubItems = hasSubItems 
                            ? item.subItems.filter(subItem => hasAccess(subItem.roles))
                            : [];

                        // Check if any subItem is active
                        const isSubItemActive = hasSubItems &&
                            filteredSubItems.some(subItem =>
                                location.pathname.startsWith(subItem.to)
                            );

                        // Si no hay subitems filtrados, no mostrar la opción de expandir
                        const showExpandOption = filteredSubItems.length > 0;

                        return (
                            <div key={item.to}>
                                <NavLink
                                    to={hasSubItems && showExpandOption ? '#' : item.to}
                                    onClick={(e) => {
                                        if (hasSubItems && showExpandOption) {
                                            e.preventDefault();
                                            toggleSubMenu(item.to);
                                        }
                                    }}
                                    className={({ isActive: linkActive }) =>
                                        `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${(isActive || isSubItemActive)
                                            ? 'bg-blue-100 text-[#508ecb] font-medium'
                                            : 'text-[#508ecb] hover:bg-black/5'
                                        }`
                                    }
                                >
                                    <item.icon
                                        size={22}
                                        className={`transition-colors duration-200 text-[#508ecb]
                                            ${expanded ? 'mr-3' : 'mx-auto'}
                                        `}
                                    />
                                    {expanded && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm flex-1"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {expanded && hasSubItems && showExpandOption && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, rotate: isSubMenuOpen(item.to) ? 90 : 0 }}
                                            className="ml-auto text-[#508ecb]"
                                        >
                                            <IconChevronRight size={16} />
                                        </motion.div>
                                    )}
                                    {expanded && (!hasSubItems || !showExpandOption) && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`ml-auto rounded-full w-1.5 h-1.5 
                                                ${isActive ? 'bg-[#508ecb]' : 'bg-transparent'}`}
                                        />
                                    )}
                                </NavLink>

                                {/* Sub menu items */}
                                {hasSubItems && expanded && showExpandOption && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: isSubMenuOpen(item.to) ? 'auto' : 0,
                                            opacity: isSubMenuOpen(item.to) ? 1 : 0
                                        }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {filteredSubItems.map((subItem) => {
                                            const isSubActive = location.pathname.startsWith(subItem.to);

                                            return (
                                                <NavLink
                                                    key={subItem.to}
                                                    to={subItem.to}
                                                    className={({ isActive }) =>
                                                        `flex items-center pl-12 pr-4 py-2 rounded-xl ml-2 transition-all duration-200 group
                                                        ${isSubActive
                                                            ? 'bg-blue-50 text-[#508ecb] font-medium'
                                                            : 'text-[#508ecb] hover:bg-black/5'
                                                        }`
                                                    }
                                                >
                                                    <subItem.icon
                                                        size={18}
                                                        className="mr-3 text-[#508ecb]"
                                                    />
                                                    <span className="text-sm">
                                                        {subItem.label}
                                                    </span>
                                                    {isSubActive && (
                                                        <div className="ml-auto rounded-full w-1.5 h-1.5 bg-[#508ecb]" />
                                                    )}
                                                </NavLink>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </motion.div>
    );
}