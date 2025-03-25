import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    IconDashboard,
    IconUsers,
    IconChartBar,
    IconGitPullRequest,
    IconSettings,
    IconChevronLeft,
    IconChevronRight,
    IconUserPlus, IconCalendarTime
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Logo from "../assets/logo_login.png"

export default function Sidebar() {
    const [expanded, setExpanded] = useState(true);
    const location = useLocation();

    const menuItems = [
        {
            icon: IconDashboard,
            label: 'Panel de Control',
            to: '/',
        },
        {
            icon: IconUsers,
            label: 'Clientes',
            to: '/clients',
        },
        {
            icon: IconChartBar,
            label: 'Ventas',
            to: '/sales',
        },
        {
            icon: IconGitPullRequest,
            label: 'Proceso',
            to: '/pipeline',
        },
        {
            icon: IconSettings,
            label: 'Configuración',
            to: '/settings',
            subItems: [
                {
                    icon: IconUserPlus,
                    label: 'Usuarios',
                    to: '/users',
                }
            ]
        },
        {
            icon: IconCalendarTime, // Importa este icono
            label: 'Tareas',
            to: '/tasks',
        },
    ];

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

                {/* Navigation */}
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = item.to === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.to);

                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        const [subMenuOpen, setSubMenuOpen] = useState(
                            hasSubItems && item.subItems.some(subItem => location.pathname.startsWith(subItem.to))
                        );

                        // Check if any subItem is active
                        const isSubItemActive = hasSubItems &&
                            item.subItems.some(subItem =>
                                location.pathname.startsWith(subItem.to)
                            );

                        return (
                            <div key={item.to}>
                                <NavLink
                                    to={hasSubItems ? '#' : item.to}
                                    onClick={(e) => {
                                        if (hasSubItems) {
                                            e.preventDefault();
                                            setSubMenuOpen(!subMenuOpen);
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
                                    {expanded && hasSubItems && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, rotate: subMenuOpen ? 90 : 0 }}
                                            className="ml-auto text-[#508ecb]"
                                        >
                                            <IconChevronRight size={16} />
                                        </motion.div>
                                    )}
                                    {expanded && !hasSubItems && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`ml-auto rounded-full w-1.5 h-1.5 
                                                ${isActive ? 'bg-[#508ecb]' : 'bg-transparent'}`}
                                        />
                                    )}
                                </NavLink>

                                {/* Sub menu items */}
                                {hasSubItems && expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: subMenuOpen ? 'auto' : 0,
                                            opacity: subMenuOpen ? 1 : 0
                                        }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {item.subItems.map((subItem) => {
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