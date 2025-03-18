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
                            <img src={Logo} className='w-24' />
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

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${isActive
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
                                        className="text-sm"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {expanded && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`ml-auto rounded-full w-1.5 h-1.5 
                                            ${isActive ? 'bg-[#508ecb]' : 'bg-transparent'}`}
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </motion.div>
    );
}