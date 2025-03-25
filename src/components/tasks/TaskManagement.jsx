import { useState } from 'react';
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
  Checkbox
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
  Paperclip,
  ExternalLink,
  Bell,
  Phone,
  Plus,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    createdBy: 'user2'
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
    createdBy: 'user1'
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
    createdBy: 'user1'
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
  
  switch (status) {
    case 'pending':
      color = 'orange';
      break;
    case 'in_progress':
      color = 'blue';
      break;
    case 'completed':
      color = 'green';
      break;
    case 'cancelled':
      color = 'red';
      break;
    default:
      color = 'gray';
  }
  
  return (
    <Badge color={color} variant="light">
      {status === 'pending' && 'Pendiente'}
      {status === 'in_progress' && 'En progreso'}
      {status === 'completed' && 'Completada'}
      {status === 'cancelled' && 'Cancelada'}
    </Badge>
  );
};

// Componente para mostrar badges de prioridad
const PriorityBadge = ({ priority }) => {
  let color = 'gray';
  
  switch (priority) {
    case 'high':
      color = 'red';
      break;
    case 'medium':
      color = 'orange';
      break;
    case 'low':
      color = 'green';
      break;
    default:
      color = 'gray';
  }
  
  return (
    <Badge color={color} variant="outline" size="sm">
      {priority === 'high' && 'Alta'}
      {priority === 'medium' && 'Media'}
      {priority === 'low' && 'Baja'}
    </Badge>
  );
};

// Formulario para crear/editar tarea
const TaskForm = ({ initialValues = null, onSubmit, onClose }) => {
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
    addToCalendar: true
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

  const handleSubmit = (values) => {
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
      createdBy: initialValues?.createdBy || 'currentUserId', // Esto debería venir del contexto de autenticación
    };
    
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
            {...form.getInputProps('title')}
          />
          
          <Select
            label="Tipo de tarea"
            placeholder="Seleccione el tipo"
            data={mockTaskTypes}
            required
            {...form.getInputProps('type')}
          />
          
          <Select
            label="Asignado a"
            placeholder="Seleccione un usuario"
            data={mockUsers}
            required
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
            />
            
            <TimeInput
              label="Hora"
              format="24"
              value={form.values.dueTime}
              onChange={(time) => form.setFieldValue('dueTime', time)}
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
              {...form.getInputProps('priority')}
            />
          </Group>
          
          <TextInput
            label="Relacionado con"
            placeholder="Cliente, proyecto o negocio"
            {...form.getInputProps('relatedTo')}
          />
          
          <Textarea
            label="Descripción"
            placeholder="Describa los detalles de la tarea"
            minRows={3}
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
          </Box>
          
          <Group position="right" mt="md">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
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
  
  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };
  
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };
  
  const handleDeleteTask = (taskId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta tarea?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };
  
  const handleCompleteTask = (taskId) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' } 
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
  
  // Filtrar tareas por pestaña
  const pendingTasks = tasks.filter(task => task.status !== 'completed' && task.status !== 'cancelled');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const myTasks = tasks.filter(task => task.assignedTo === 'user1'); // Esto debería usar el ID del usuario actual
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Tareas</h2>
        <Button 
          onClick={handleCreateTask}
          leftIcon={<Plus size={16} />}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Nueva Tarea
        </Button>
      </div>
      
      <Tabs defaultValue="pending" className="mb-6">
        <Tabs.List>
          <Tabs.Tab value="pending" icon={<Clock size={16} />}>
            Pendientes ({pendingTasks.length})
          </Tabs.Tab>
          <Tabs.Tab value="completed" icon={<CheckCircle size={16} />}>
            Completadas ({completedTasks.length})
          </Tabs.Tab>
          <Tabs.Tab value="my-tasks" icon={<UserIcon size={16} />}>
            Mis Tareas ({myTasks.length})
          </Tabs.Tab>
          <Tabs.Tab value="calendar" icon={<Calendar size={16} />}>
            Calendario
          </Tabs.Tab>
        </Tabs.List>
        
        <Tabs.Panel value="pending" pt="md">
          <Table>
            <thead>
              <tr>
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
                      <span>{task.title}</span>
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
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <CheckCircle size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Editar">
                        <ActionIcon 
                          color="blue" 
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon>
                            <MoreVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item icon={<Calendar size={16} />}>
                            Ver en calendario
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
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No hay tareas pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tabs.Panel>
        
        <Tabs.Panel value="completed" pt="md">
          <Table>
            <thead>
              <tr>
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
                    </div>
                  </td>
                  <td>{mockTaskTypes.find(t => t.value === task.type)?.label || task.type}</td>
                  <td>{task.dueDate.toLocaleDateString()}</td>
                  <td>{mockUsers.find(u => u.value === task.assignedTo)?.label || task.assignedTo}</td>
                  <td>
                    <Group spacing={4}>
                      <Tooltip label="Ver detalles">
                        <ActionIcon color="blue" onClick={() => handleEditTask(task)}>
                          <Edit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Eliminar">
                        <ActionIcon color="red" onClick={() => handleDeleteTask(task.id)}>
                          <Trash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))}
              {completedTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No hay tareas completadas
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tabs.Panel>
        
        <Tabs.Panel value="my-tasks" pt="md">
          <Table>
            <thead>
              <tr>
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
                      <span>{task.title}</span>
                    </div>
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
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <CheckCircle size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Editar">
                        <ActionIcon 
                          color="blue" 
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Eliminar">
                        <ActionIcon 
                          color="red" 
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
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No tienes tareas asignadas
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Tabs.Panel>
        
        <Tabs.Panel value="calendar" pt="md">
          <div className="bg-gray-100 p-8 rounded-lg flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Vista de calendario (Integración con Google Calendar)</p>
              <Button 
                variant="outline" 
                leftIcon={<ExternalLink size={16} />} 
                className="mt-4"
              >
                Abrir en Google Calendar
              </Button>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
      
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTask ? "Editar tarea" : "Crear nueva tarea"}
        size="lg"
      >
        <TaskForm
          initialValues={currentTask}
          onSubmit={handleSubmitTask}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TaskManagement; 