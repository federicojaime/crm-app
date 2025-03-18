import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconBell,
    IconMail,
    IconLogout,
    IconChevronDown,
    IconSettings,
    IconUser,
    IconMessageCircle,
} from '@tabler/icons-react';
import { Menu, Button, Indicator } from '@mantine/core';

export default function TopBar() {
    const navigate = useNavigate();
    const [notifications] = useState(3);
    const [messages] = useState(2);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="h-14 bg-gray-900 border-b border-gray-800 px-3 flex items-center justify-end sticky top-0 z-50">
            <div className="flex items-center space-x-1">
                {/* Notificaciones */}
                <Menu position="bottom-end" offset={5}>
                    <Menu.Target>
                        <Button variant="subtle" p={0} className="h-12 w-10 text-gray-300 hover:text-gray-100">
                            <Indicator
                                label={notifications}
                                size={16}
                                position="top-center"
                                color="blue"
                            >
                                <IconBell size={20} stroke={1.5} />
                            </Indicator>
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown className="bg-gray-800 border-gray-700">
                        <Menu.Label className="text-gray-400">Notificaciones</Menu.Label>
                        <Menu.Item
                            icon={<IconMessageCircle size={14} />}
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Nueva venta registrada
                        </Menu.Item>
                        <Menu.Item
                            icon={<IconMessageCircle size={14} />}
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Cliente contactado
                        </Menu.Item>
                        <Menu.Item
                            icon={<IconMessageCircle size={14} />}
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Reunión programada
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

                {/* Mensajes */}
                <Menu position="bottom-end" offset={5}>
                    <Menu.Target>
                        <Button variant="subtle" p={0} className="h-12 w-10 text-gray-300 hover:text-gray-100">
                            <Indicator
                                label={messages}
                                size={16}
                                position="top-center"
                                color="blue"
                            >
                                <IconMail size={20} stroke={1.5} />
                            </Indicator>
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown className="bg-gray-800 border-gray-700">
                        <Menu.Label className="text-gray-400">Mensajes</Menu.Label>
                        <Menu.Item
                            icon={<IconUser size={14} />}
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Mensaje de Juan Pérez
                        </Menu.Item>
                        <Menu.Item
                            icon={<IconUser size={14} />}
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Mensaje de María López
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

                {/* Menú de usuario */}
                <Menu position="bottom-end" offset={5}>
                    <Menu.Target>
                        <Button variant="subtle" className="h-9 pl-1 pr-2 text-gray-300 hover:text-gray-100">
                            <div className="flex items-center gap-2">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.nombre}+${user?.apellido}&background=random`}
                                    alt="Perfil"
                                    className="w-7 h-7 rounded-full"
                                />
                                <div className="text-left hidden md:block max-w-[150px]">
                                    <div className="text-sm font-medium truncate text-gray-300">
                                        {user?.nombre} {user?.apellido}
                                    </div>
                                    <div className="text-xs text-gray-400 truncate">
                                        {user?.email}
                                    </div>
                                </div>
                                <IconChevronDown size={16} className="text-gray-400" />
                            </div>
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown className="bg-gray-800 border-gray-700">
                        <Menu.Label className="text-gray-400">Configuración</Menu.Label>
                        <Menu.Item
                            icon={<IconSettings size={14} />}
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Perfil
                        </Menu.Item>
                        <Menu.Item
                            icon={<IconUser size={14} />}
                            className="text-gray-300 hover:bg-gray-700"
                        >
                            Cuenta
                        </Menu.Item>
                        <Menu.Item className="text-gray-300 hover:bg-gray-700">
                            Preferencias
                        </Menu.Item>
                        <Menu.Divider className="border-gray-700" />
                        <Menu.Item
                            className="text-red-400 hover:bg-gray-700"
                            icon={<IconLogout size={14} />}
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </header>
    );
}