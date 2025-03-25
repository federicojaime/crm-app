// src/components/tasks/TaskManagement.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Select,
    TextInput,
    Textarea,
    Group,
    Stack,
    Badge,
    Modal,
    Tabs,
    Table,
    ActionIcon,
    Tooltip,
    Menu,
    Checkbox,
    Alert,
    Text,
    Card,
    Title
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
    Calendar,
    Clock,
    Users,
    Mail,
    FileText,
    MoreVertical,
    Edit,
    Trash,
    CheckCircle,
    Plus,
    User,
    AlertCircle,
    Phone,
    Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { googleCalendarService } from '../../services/GoogleCalendarService';
import CalendarView from '../calendar/CalendarView';

// Datos de ejemplo
const mockUsers = [
    { value: 'user1', label: 'Juan Pérez' },
    { value: 'user2', label: 'María López' },
    { value: 'user3', label: 'Carlos Rodríguez' },
];

const mockTaskTypes = [
    { value: 'call', label: 'Llamada', icon: <Phone size={16} /> },
    { value: 'email', label: 'Correo electrónico', icon: <Mail size={16} /> },
    { value: 'meeting', label: 'Reunión', icon: <Users size={16} /> },
    { value: 'followup', label: 'Seguimiento', icon: <Clock size={16} /> },
    { value: 'document', label: 'Documento', icon: <FileText size={16} /> },
];

const mockTasks = [
    {
        id: 1,
        title: 'Llamar a cliente potencial',
        type: 'call',
        assignedTo: 'user1',
        dueDate: new Date('2025-04-01T10:00:00'),
        status: 'pending',
        priority: 'high',
        description: 'Llamar para presentar productos nuevos',
        relatedTo: 'Juan Gómez',
        createdAt: new Date('2025-03-28T15:30:00'),
        createdBy: 'user2',
        eventId: null,
        calendarId: null
    },
    {
        id: 2,
        title: 'Enviar presupuesto',
        type: 'email',
        assignedTo: 'user2',
        dueDate: new Date('2025-04-02T12:00:00'),
        status: 'completed',
        priority: 'medium',
        description: 'Enviar presupuesto actualizado para la campaña de marketing',
        relatedTo: 'Empresa ABC',
        createdAt: new Date('2025-03-29T09:15:00'),
        createdBy: 'user1',
        eventId: null,
        calendarId: null
    },
    {
        id: 3,
        title: 'Reunión seguimiento',
        type: 'meeting',
        assignedTo: 'user3',
        dueDate: new Date('2025-04-03T15:30:00'),
        status: 'pending',
        priority: 'low',
        description: 'Reunión de seguimiento para discutir avances',
        relatedTo: 'Proyecto XYZ',
        createdAt: new Date('2025-03-30T11:45:00'),
        createdBy: 'user1',
        eventId: null,
        calendarId: null
    }
];

// Componente para mostrar iconos según el tipo de tarea
const TaskTypeIcon = ({ type }) => {
    switch (type) {
        case 'call':
            return <Phone size={16} className="text-blue-500" />;
        case 'email':
            return <Mail size={16} className="text-green-500" />;
        case 'meeting':
            return <Users size={16} className="text-purple-500" />;
        case 'followup':
            return <Clock size={16} className="text-orange-500" />;
        case 'document':
            return <FileText size={16} className="text-red-500" />;
        default:
            return null;
    }
};

// Componente para mostrar badges de estado
const StatusBadge = ({ status }) => {
    let color = 'gray';
    let label = 'Desconocido';

    switch (status) {
        case 'pending':
            color = 'orange';
            label = 'Pendiente';
            break;
        case 'in_progress':
            color = 'blue';
            label = 'En progreso';
            break;
        case 'completed':
            color = 'green';
            label = 'Completada';
            break;
        case 'cancelled':
            color = 'red';
            label = 'Cancelada';
            break;
    }

    return (
        <Badge
            color={color}
            variant="light"
            className="font-normal text-xs px-2 py-1"
        >
            {label}
        </Badge>
    );
};

// Componente para mostrar badges de prioridad
const PriorityBadge = ({ priority }) => {
    let color = 'gray';
    let label = 'Normal';

    switch (priority) {
        case 'high':
            color = 'red';
            label = 'ALTA';
            break;
        case 'medium':
            color = 'orange';
            label = 'MEDIA';
            break;
        case 'low':
            color = 'green';
            label = 'BAJA';
            break;
    }

    return (
        <Badge
            color={color}
            variant="outline"
            size="sm"
            className="uppercase font-medium text-xs px-2 py-1"
        >
            {label}
        </Badge>
    );
};

// Formulario para crear/editar tarea
const TaskForm = ({ initialValues = null, onSubmit, onClose }) => {
    const [googleCalendarError, setGoogleCalendarError] = useState(null);
    const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);

    useEffect(() => {
        const checkGoogleAuth = async () => {
            try {
                await googleCalendarService.init();
                setIsGoogleAuthorized(googleCalendarService.isAuthorized);
            } catch (err) {
                console.error('Error al verificar autorización de Google Calendar:', err);
            }
        };

        checkGoogleAuth();
    }, []);

    const defaultValues = {
        title: '',
        type: '',
        assignedTo: '',
        dueDate: new Date(),
        dueTime: new Date(),
        status: 'pending',
        priority: 'medium',
        description: '',
        relatedTo: '',
        reminderEnabled: false,
        reminderTime: '30',
        addToCalendar: true,
        eventId: null,
        calendarId: null
    };

    const form = useForm({
        initialValues: initialValues || defaultValues,
        validate: {
            title: (value) => !value ? 'El título es requerido' : null,
            type: (value) => !value ? 'El tipo de tarea es requerido' : null,
            assignedTo: (value) => !value ? 'Asignar a alguien es requerido' : null,
            dueDate: (value) => !value ? 'La fecha de vencimiento es requerida' : null,
        }
    });

    const handleConnectGoogle = async () => {
        setGoogleCalendarError(null);
        try {
            await googleCalendarService.authorize();
            setIsGoogleAuthorized(true);
        } catch (err) {
            console.error('Error al autorizar Google Calendar:', err);
            setGoogleCalendarError('No se pudo conectar con Google Calendar');
        }
    };

    const handleSubmit = async (values) => {
        // Combinar fecha y hora para el vencimiento
        const dueDate = new Date(values.dueDate);
        const dueTime = new Date(values.dueTime);

        dueDate.setHours(
            dueTime.getHours(),
            dueTime.getMinutes(),
            0,
            0
        );

        const taskData = {
            ...values,
            dueDate,
            id: initialValues?.id || Date.now(),
            createdAt: initialValues?.createdAt || new Date(),
            createdBy: initialValues?.createdBy || 'currentUserId',
        };

        // Si se seleccionó agregar a Google Calendar y estamos autorizados
        if (values.addToCalendar && isGoogleAuthorized) {
            try {
                // Convertir la tarea a formato de evento de Google Calendar
                const eventData = googleCalendarService.taskToCalendarEvent(taskData);

                // Si estamos editando una tarea que ya tenía un evento
                if (initialValues?.eventId) {
                    await googleCalendarService.updateEvent(
                        initialValues.eventId,
                        eventData,
                        initialValues.calendarId || 'primary'
                    );
                    taskData.eventId = initialValues.eventId;
                    taskData.calendarId = initialValues.calendarId;
                } else {
                    // Crear nuevo evento
                    const newEvent = await googleCalendarService.createEvent(eventData);
                    taskData.eventId = newEvent.id;
                    taskData.calendarId = 'primary';
                }
            } catch (err) {
                console.error('Error al sincronizar con Google Calendar:', err);
                setGoogleCalendarError('No se pudo sincronizar con Google Calendar');
                // Continuamos con la creación de la tarea aunque falle la sincronización
            }
        }

        onSubmit(taskData);
        onClose();
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <TextInput
                        label="Título"
                        placeholder="Ingrese el título de la tarea"
                        required
                        classNames={{
                            root: "mb-3",
                            label: "text-sm font-medium text-gray-700 mb-1",
                            input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        }}
                        {...form.getInputProps('title')}
                    />

                    <Select
                        label="Tipo de tarea"
                        placeholder="Seleccione el tipo"
                        data={mockTaskTypes}
                        required
                        classNames={{
                            root: "mb-3",
                            label: "text-sm font-medium text-gray-700 mb-1",
                            input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        }}
                        {...form.getInputProps('type')}
                    />

                    <Select
                        label="Asignado a"
                        placeholder="Seleccione un usuario"
                        data={mockUsers}
                        required
                        classNames={{
                            root: "mb-3",
                            label: "text-sm font-medium text-gray-700 mb-1",
                            input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        }}
                        {...form.getInputProps('assignedTo')}
                    />

                    <Group grow>
                        <DatePicker
                            label="Fecha de vencimiento"
                            placeholder="Seleccione la fecha"
                            required
                            value={form.values.dueDate}
                            onChange={(date) => form.setFieldValue('dueDate', date)}
                            minDate={new Date()}
                            classNames={{
                                root: "mb-3",
                                label: "text-sm font-medium text-gray-700 mb-1",
                                input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            }}
                        />

                        <TimeInput
                            label="Hora"
                            format="24"
                            value={form.values.dueTime}
                            onChange={(time) => form.setFieldValue('dueTime', time)}
                            classNames={{
                                root: "mb-3",
                                label: "text-sm font-medium text-gray-700 mb-1",
                                input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            }}
                        />
                    </Group>

                    <Group grow>
                        <Select
                            label="Estado"
                            placeholder="Seleccione el estado"
                            data={[
                                { value: 'pending', label: 'Pendiente' },
                                { value: 'in_progress', label: 'En progreso' },
                                { value: 'completed', label: 'Completada' },
                                { value: 'cancelled', label: 'Cancelada' }
                            ]}
                            classNames={{
                                root: "mb-3",
                                label: "text-sm font-medium text-gray-700 mb-1",
                                input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            }}
                            {...form.getInputProps('status')}
                        />

                        <Select
                            label="Prioridad"
                            placeholder="Seleccione la prioridad"
                            data={[
                                { value: 'high', label: 'Alta' },
                                { value: 'medium', label: 'Media' },
                                { value: 'low', label: 'Baja' }
                            ]}
                            classNames={{
                                root: "mb-3",
                                label: "text-sm font-medium text-gray-700 mb-1",
                                input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            }}
                            {...form.getInputProps('priority')}
                        />
                    </Group>

                    <TextInput
                        label="Relacionado con"
                        placeholder="Cliente, proyecto o negocio"
                        classNames={{
                            root: "mb-3",
                            label: "text-sm font-medium text-gray-700 mb-1",
                            input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        }}
                        {...form.getInputProps('relatedTo')}
                    />

                    <Textarea
                        label="Descripción"
                        placeholder="Describa los detalles de la tarea"
                        minRows={3}
                        classNames={{
                            root: "mb-3",
                            label: "text-sm font-medium text-gray-700 mb-1",
                            input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        }}
                        {...form.getInputProps('description')}
                    />

                    <Box className="bg-blue-50 p-4 rounded-lg">
                        <Group>
                            <Checkbox
                                label="Agregar recordatorio"
                                checked={form.values.reminderEnabled}
                                onChange={(event) => form.setFieldValue('reminderEnabled', event.currentTarget.checked)}
                            />
                        </Group>

                        {form.values.reminderEnabled && (
                            <Group className="mt-3">
                                <Select
                                    label="Tiempo antes"
                                    data={[
                                        { value: '5', label: '5 minutos antes' },
                                        { value: '15', label: '15 minutos antes' },
                                        { value: '30', label: '30 minutos antes' },
                                        { value: '60', label: '1 hora antes' },
                                        { value: '1440', label: '1 día antes' }
                                    ]}
                                    className="w-64"
                                    classNames={{
                                        input: "rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    }}
                                    {...form.getInputProps('reminderTime')}
                                />
                            </Group>
                        )}

                        <Group className="mt-3">
                            <Checkbox
                                label="Agregar a Google Calendar"
                                checked={form.values.addToCalendar}
                                onChange={(event) => form.setFieldValue('addToCalendar', event.currentTarget.checked)}
                            />
                        </Group>

                        {form.values.addToCalendar && (
                            <div className="mt-3">
                                {!isGoogleAuthorized ? (
                                    <div>
                                        <Button
                                            size="sm"
                                            onClick={handleConnectGoogle}
                                            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Conectar con Google Calendar
                                        </Button>

                                        {googleCalendarError && (
                                            <Alert color="red" className="mt-2 text-sm" icon={<AlertCircle size={16} />}>
                                                {googleCalendarError}
                                            </Alert>
                                        )}
                                    </div>
                                ) : (
                                    <Text size="sm" className="text-green-600 flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Conectado a Google Calendar
                                    </Text>
                                )}
                            </div>
                        )}
                    </Box>

                    <Group position="right" mt="md">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {initialValues ? 'Actualizar tarea' : 'Crear tarea'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
};

// Componente principal para la gestión de tareas
const TaskManagement = () => {
    const [tasks, setTasks] = useState(mockTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [taskToSync, setTaskToSync] = useState(null);
    const [syncError, setSyncError] = useState(null);
    const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);

    // Verificar si estamos autorizados con Google Calendar
    useEffect(() => {
        const checkGoogleAuth = async () => {
            try {
                await googleCalendarService.init();
                setIsGoogleAuthorized(googleCalendarService.isAuthorized);
            } catch (err) {
                console.error('Error al verificar autorización de Google Calendar:', err);
            }
        };

        checkGoogleAuth();
    }, []);

    const handleCreateTask = () => {
        setCurrentTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('¿Está seguro que desea eliminar esta tarea?')) {
            // Buscar la tarea para ver si tiene un evento en Google Calendar
            const taskToDelete = tasks.find(task => task.id === taskId);

            if (taskToDelete?.eventId) {
                try {
                    // Intentar eliminar el evento de Google Calendar
                    await googleCalendarService.deleteEvent(
                        taskToDelete.eventId,
                        taskToDelete.calendarId || 'primary'
                    );
                } catch (error) {
                    console.error('Error al eliminar evento de Google Calendar:', error);
                }
            }

            setTasks(tasks.filter(task => task.id !== taskId));
        }
    };

    const handleCompleteTask = async (taskId) => {
        const taskToUpdate = tasks.find(task => task.id === taskId);

        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, status: 'completed' };

        // Si la tarea tiene un evento en Google Calendar y está completada, 
        // podemos actualizar el evento para reflejar esto
        if (updatedTask.eventId) {
            try {
                const eventData = googleCalendarService.taskToCalendarEvent(updatedTask);
                eventData.summary = `[COMPLETADA] ${eventData.summary}`;

                await googleCalendarService.updateEvent(
                    updatedTask.eventId,
                    eventData,
                    updatedTask.calendarId || 'primary'
                );
            } catch (error) {
                console.error('Error al actualizar evento en Google Calendar:', error);
            }
        }

        setTasks(
            tasks.map(task =>
                task.id === taskId
                    ? updatedTask
                    : task
            )
        );
    };

    const handleSubmitTask = (taskData) => {
        if (currentTask) {
            // Actualizar tarea existente
            setTasks(
                tasks.map(task =>
                    task.id === taskData.id
                        ? { ...taskData }
                        : task
                )
            );
        } else {
            // Crear nueva tarea
            setTasks([...tasks, taskData]);
        }
    };

    const handleSyncTask = (task) => {
        setTaskToSync(task);
        setIsSyncModalOpen(true);
    };

    const handleConfirmSync = async () => {
        if (!taskToSync) return;

        setSyncError(null);

        try {
            // Verificar si estamos autorizados con Google
            await googleCalendarService.init();

            if (!googleCalendarService.isAuthorized) {
                await googleCalendarService.authorize();
                setIsGoogleAuthorized(true);
            }

            // Convertir la tarea a formato de evento de Google Calendar
            const eventData = googleCalendarService.taskToCalendarEvent(taskToSync);

            let updatedTask = { ...taskToSync };

            // Si la tarea ya tiene un evento, actualizarlo
            if (taskToSync.eventId) {
                await googleCalendarService.updateEvent(
                    taskToSync.eventId,
                    eventData,
                    taskToSync.calendarId || 'primary'
                );
            } else {
                // Si no tiene evento, crear uno nuevo
                const newEvent = await googleCalendarService.createEvent(eventData);
                updatedTask = {
                    ...updatedTask,
                    eventId: newEvent.id,
                    calendarId: 'primary'
                };
            }

            // Actualizar la tarea con la información del evento
            setTasks(
                tasks.map(task =>
                    task.id === updatedTask.id
                        ? updatedTask
                        : task
                )
            );

            setIsSyncModalOpen(false);
            setTaskToSync(null);

        } catch (error) {
            console.error('Error al sincronizar con Google Calendar:', error);
            setSyncError('No se pudo sincronizar con Google Calendar. Intente nuevamente.');
        }
    };

    // Filtrar tareas por pestaña
    const pendingTasks = tasks.filter(task => task.status !== 'completed' && task.status !== 'cancelled');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const myTasks = tasks.filter(task => task.assignedTo === 'user1'); // Esto debería usar el ID del usuario actual

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Gestións de Tareas</h2>
                <Button
                    onClick={handleCreateTask}
                    leftIcon={<Plus size={16} />}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Nueva Tarea
                </Button>
            </div>

            <Tabs
                value={activeTab}
                onTabChange={setActiveTab}
                className="px-6"
            >
                <Tabs.List>
                    <Tabs.Tab
                        value="pending"
                        icon={<Clock size={16} />}
                        className="px-4 py-3"
                    >
                        Pendientes ({pendingTasks.length})
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="completed"
                        icon={<CheckCircle size={16} />}
                        className="px-4 py-3"
                    >
                        Completadas ({completedTasks.length})
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="my-tasks"
                        icon={<User size={16} />}
                        className="px-4 py-3"
                    >
                        Mis Tareas ({myTasks.length})
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="calendar"
                        icon={<Calendar size={16} />}
                        className="px-4 py-3"
                    >
                        Calendario
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="pending" pt="md">
                    <div className="overflow-x-auto">
                        <Table striped>
                            <thead>
                                <tr className="bg-gray-50">
                                    <th>Título</th>
                                    <th>Tipo</th>
                                    <th>Vencimiento</th>
                                    <th>Asignado a</th>
                                    <th>Prioridad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <TaskTypeIcon type={task.type} />
                                                <span className="font-medium">{task.title}</span>
                                                {task.eventId && (
                                                    <Tooltip label="Sincronizado con Google Calendar">
                                                        <Calendar size={14} className="text-blue-500" />
                                                    </Tooltip>
                                                )}
                                            </div>
                                            {task.relatedTo && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {task.relatedTo}
                                                </div>
                                            )}
                                        </td>
                                        <td>{mockTaskTypes.find(t => t.value === task.type)?.label || task.type}</td>
                                        <td>
                                            <div className="whitespace-nowrap font-medium">
                                                {task.dueDate.toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td>{mockUsers.find(u => u.value === task.assignedTo)?.label || task.assignedTo}</td>
                                        <td>
                                            <PriorityBadge priority={task.priority} />
                                        </td>
                                        <td>
                                            <StatusBadge status={task.status} />
                                        </td>
                                        <td>
                                            <Group spacing={4}>
                                                <Tooltip label="Marcar como completada">
                                                    <ActionIcon
                                                        color="green"
                                                        variant="light"
                                                        onClick={() => handleCompleteTask(task.id)}
                                                    >
                                                        <CheckCircle size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Editar">
                                                    <ActionIcon
                                                        color="blue"
                                                        variant="light"
                                                        onClick={() => handleEditTask(task)}
                                                    >
                                                        <Edit size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Menu position="bottom-end" shadow="md">
                                                    <Menu.Target>
                                                        <ActionIcon variant="light">
                                                            <MoreVertical size={16} />
                                                        </ActionIcon>
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            icon={<Calendar size={16} />}
                                                            onClick={() => handleSyncTask(task)}
                                                        >
                                                            {task.eventId ? 'Actualizar en calendario' : 'Agregar a calendario'}
                                                        </Menu.Item>
                                                        <Menu.Item icon={<Bell size={16} />}>
                                                            Recordatorio
                                                        </Menu.Item>
                                                        <Menu.Divider />
                                                        <Menu.Item
                                                            icon={<Trash size={16} />}
                                                            color="red"
                                                            onClick={() => handleDeleteTask(task.id)}
                                                        >
                                                            Eliminar
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Group>
                                        </td>
                                    </tr>
                                ))}
                                {pendingTasks.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            No hay tareas pendientes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="completed" pt="md">
                    <div className="overflow-x-auto">
                        <Table striped>
                            <thead>
                                <tr className="bg-gray-50">
                                    <th>Título</th>
                                    <th>Tipo</th>
                                    <th>Fecha completada</th>
                                    <th>Asignado a</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <TaskTypeIcon type={task.type} />
                                                <span className="line-through text-gray-500">{task.title}</span>
                                                {task.eventId && (
                                                    <Tooltip label="Sincronizado con Google Calendar">
                                                        <Calendar size={14} className="text-blue-500" />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </td>
                                        <td>{mockTaskTypes.find(t => t.value === task.type)?.label || task.type}</td>
                                        <td>{task.dueDate.toLocaleDateString()}</td>
                                        <td>{mockUsers.find(u => u.value === task.assignedTo)?.label || task.assignedTo}</td>
                                        <td>
                                            <Group spacing={4}>
                                                <Tooltip label="Ver detalles">
                                                    <ActionIcon
                                                        color="blue"
                                                        variant="light"
                                                        onClick={() => handleEditTask(task)}
                                                    >
                                                        <Edit size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Eliminar">
                                                    <ActionIcon
                                                        color="red"
                                                        variant="light"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        <Trash size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </td>
                                    </tr>
                                ))}
                                {completedTasks.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">
                                            No hay tareas completadas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="my-tasks" pt="md">
                    <div className="overflow-x-auto">
                        <Table striped>
                            <thead>
                                <tr className="bg-gray-50">
                                    <th>Título</th>
                                    <th>Tipo</th>
                                    <th>Vencimiento</th>
                                    <th>Prioridad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <TaskTypeIcon type={task.type} />
                                                <span className="font-medium">{task.title}</span>
                                                {task.eventId && (
                                                    <Tooltip label="Sincronizado con Google Calendar">
                                                        <Calendar size={14} className="text-blue-500" />
                                                    </Tooltip>
                                                )}
                                            </div>
                                            {task.relatedTo && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {task.relatedTo}
                                                </div>
                                            )}
                                        </td>
                                        <td>{mockTaskTypes.find(t => t.value === task.type)?.label || task.type}</td>
                                        <td>
                                            <div className="whitespace-nowrap">
                                                {task.dueDate.toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td>
                                            <PriorityBadge priority={task.priority} />
                                        </td>
                                        <td>
                                            <StatusBadge status={task.status} />
                                        </td>
                                        <td>
                                            <Group spacing={4}>
                                                <Tooltip label="Marcar como completada">
                                                    <ActionIcon
                                                        color="green"
                                                        variant="light"
                                                        onClick={() => handleCompleteTask(task.id)}
                                                    >
                                                        <CheckCircle size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Editar">
                                                    <ActionIcon
                                                        color="blue"
                                                        variant="light"
                                                        onClick={() => handleEditTask(task)}
                                                    >
                                                        <Edit size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Eliminar">
                                                    <ActionIcon
                                                        color="red"
                                                        variant="light"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        <Trash size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </td>
                                    </tr>
                                ))}
                                {myTasks.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            No tienes tareas asignadas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="calendar" pt="md">
                    <CalendarView
                        tasks={tasks}
                        onSyncTask={handleSyncTask}
                        onEditTask={handleEditTask}
                    />
                </Tabs.Panel>
            </Tabs>

            {/* Modal para crear/editar tarea */}
            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<Text size="lg" weight={600}>{currentTask ? "Editar tarea" : "Crear nueva tarea"}</Text>}
                size="lg"
            >
                <TaskForm
                    initialValues={currentTask}
                    onSubmit={handleSubmitTask}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Modal para sincronizar tarea con Google Calendar */}
            <Modal
                opened={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                title={<Text size="lg" weight={600}>Sincronizar con Google Calendar</Text>}
            >
                <Box>
                    {taskToSync && (
                        <>
                            <Text className="mb-4">
                                ¿Desea {taskToSync.eventId ? 'actualizar' : 'agregar'} esta tarea a Google Calendar?
                            </Text>

                            <Box className="bg-gray-50 p-4 rounded-lg mb-4">
                                <Text weight={600} className="mb-2">{taskToSync.title}</Text>
                                <div className="text-sm text-gray-600">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={14} />
                                        <span>{taskToSync.dueDate.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={14} />
                                        <span>{taskToSync.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {taskToSync.description && (
                                        <div className="mt-2">{taskToSync.description}</div>
                                    )}
                                </div>
                            </Box>

                            {!isGoogleAuthorized && (
                                <Alert color="yellow" className="mb-4" icon={<AlertCircle size={16} />}>
                                    Es necesario conectarse a Google Calendar primero.
                                </Alert>
                            )}

                            {syncError && (
                                <Alert color="red" className="mb-4" icon={<AlertCircle size={16} />}>
                                    {syncError}
                                </Alert>
                            )}

                            <Group position="right">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSyncModalOpen(false)}
                                    className="border-gray-300 text-gray-700"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="blue"
                                    onClick={handleConfirmSync}
                                    disabled={!isGoogleAuthorized}
                                >
                                    {isGoogleAuthorized ? 'Confirmar' : 'Conectar con Google'}
                                </Button>
                            </Group>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default TaskManagement;