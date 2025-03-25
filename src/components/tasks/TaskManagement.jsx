// src/components/tasks/TaskManagement.jsx
import { useState } from 'react';
import { Button, ActionIcon, Tooltip } from '@mantine/core';
import {
  CheckCircle,
  Plus,
  Edit,
  Trash,
  Clock,
  User,
  Calendar as CalendarIcon,
} from 'lucide-react';
import TaskFormModal from './TaskFormModal';
import CalendarView from '../calendar/CalendarView';

// Arranca vacío (o con datos mock)
const initialTasks = [];

const TaskManagement = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  // Filtrar tareas
  const pendingTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const myTasks = tasks.filter((t) => t.assignedTo === 'user1'); // Ajusta con el ID real

  // CRUD
  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCompleteTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'completed' } : t
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta tarea?')) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleSubmitTask = (taskData) => {
    if (currentTask) {
      // Editar
      setTasks((prev) => prev.map((t) => (t.id === taskData.id ? taskData : t)));
    } else {
      // Crear
      setTasks((prev) => [...prev, taskData]);
    }
  };

  // Tabla de tareas
  const renderTaskTable = (taskList) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Título
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tipo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Vencimiento
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Asignado a
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Estado
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {taskList.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <span
                  className={
                    task.status === 'completed' ? 'line-through text-gray-500' : 'font-medium'
                  }
                >
                  {task.title}
                </span>
                {task.relatedTo && (
                  <div className="text-xs text-gray-500 mt-1">
                    {task.relatedTo}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{task.type}</td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-700">
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(task.dueDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{task.assignedTo}</td>
              <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                {task.status}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-2 justify-end">
                  {task.status !== 'completed' && (
                    <Tooltip label="Marcar como completada">
                      <ActionIcon
                        color="green"
                        variant="light"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        <CheckCircle size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
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
                </div>
              </td>
            </tr>
          ))}
          {taskList.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                No hay tareas en esta categoría
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Tareas</h2>
        <Button
          onClick={handleCreateTask}
          leftIcon={<Plus size={16} />}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Nueva Tarea
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={16} />
            Pendientes ({pendingTasks.length})
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle size={16} />
            Completadas ({completedTasks.length})
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 ${
              activeTab === 'my-tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('my-tasks')}
          >
            <User size={16} />
            Mis Tareas ({myTasks.length})
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm border-b-2 flex items-center gap-2 ${
              activeTab === 'calendar'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarIcon size={16} />
            Calendario
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'pending' && renderTaskTable(pendingTasks)}
        {activeTab === 'completed' && renderTaskTable(completedTasks)}
        {activeTab === 'my-tasks' && renderTaskTable(myTasks)}
        {activeTab === 'calendar' && <CalendarView />}
      </div>

      {/* Modal de tareas */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialValues={currentTask}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
};

export default TaskManagement;
