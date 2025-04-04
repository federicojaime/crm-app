// src/components/tasks/TaskFormModal.jsx
import { useState, useEffect } from 'react';
import { Button, Select, TextInput, Textarea, Stack, Box, Checkbox } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { X, Calendar, Check, Save, Clock, User, Tag, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { googleCalendarService } from '../../services/GoogleCalendarService';

const mockUsers = [
  { value: 'user1', label: 'Juan Pérez' },
  { value: 'user2', label: 'María López' },
  { value: 'user3', label: 'Carlos Rodríguez' },
];

const mockTaskTypes = [
  { value: 'call', label: 'Llamada' },
  { value: 'email', label: 'Correo electrónico' },
  { value: 'meeting', label: 'Reunión' },
  { value: 'followup', label: 'Seguimiento' },
  { value: 'document', label: 'Documento' },
];

const TaskFormModal = ({ isOpen, onClose, initialValues = null, onSubmit }) => {
  // Estados separados para fecha y hora
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  
  const [isGCalEnabled, setIsGCalEnabled] = useState(false);
  const [isGCalAuthorizing, setIsGCalAuthorizing] = useState(false);
  const [calendarError, setCalendarError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opciones para los selectores de hora y minuto
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  const minuteOptions = ['00', '15', '30', '45'];

  const defaultValues = {
    title: '',
    type: '',
    assignedTo: '',
    status: 'pending',
    priority: 'medium',
    description: '',
    relatedTo: '',
    reminderEnabled: false,
    reminderTime: '30',
    addToCalendar: initialValues?.eventId ? true : false,
    eventId: initialValues?.eventId || null,
    calendarId: initialValues?.calendarId || null,
  };

  const form = useForm({
    initialValues: initialValues || defaultValues,
    validate: {
      title: (value) => (!value ? 'El título es requerido' : null),
      type: (value) => (!value ? 'El tipo de tarea es requerido' : null),
      assignedTo: (value) => (!value ? 'Asignar a alguien es requerido' : null),
    },
  });

  // Cargar valores iniciales cuando se edita una tarea existente
  useEffect(() => {
    if (initialValues) {
      const dueDate = initialValues.dueDate ? new Date(initialValues.dueDate) : new Date();
      setSelectedDate(dueDate);
      setSelectedHour(dueDate.getHours().toString().padStart(2, '0'));
      setSelectedMinute(dueDate.getMinutes().toString().padStart(2, '0'));
      
      if (initialValues.eventId) {
        setIsGCalEnabled(true);
      }
    } else {
      // Valores por defecto para nueva tarea
      setSelectedDate(new Date());
      setSelectedHour('09');
      setSelectedMinute('00');
    }
  }, [initialValues, isOpen]);

  const handleConnectGoogleCalendar = async () => {
    setIsGCalAuthorizing(true);
    setCalendarError(null);
    try {
      await googleCalendarService.init();
      if (!googleCalendarService.isAuthorized) {
        await googleCalendarService.authorize();
      }
      setIsGCalEnabled(true);
      form.setFieldValue('addToCalendar', true);
    } catch (err) {
      console.error('Error al conectar con Google Calendar:', err);
      setCalendarError('No se pudo conectar con Google Calendar. Puedes continuar sin esta funcionalidad.');
    } finally {
      setIsGCalAuthorizing(false);
    }
  };

  // Función para combinar fecha y hora en un objeto Date
  const combineDateAndTime = (date, hour, minute) => {
    const result = new Date(date);
    result.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
    return result;
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      
      // Combinar fecha y hora para la fecha de vencimiento
      const dueDate = combineDateAndTime(selectedDate, selectedHour, selectedMinute);

      const taskData = {
        ...values,
        dueDate,
        id: initialValues?.id || Date.now(),
        createdAt: initialValues?.createdAt || new Date(),
        createdBy: initialValues?.createdBy || 'currentUserId',
      };

      // Sincronizar con Google Calendar
      if (values.addToCalendar && (isGCalEnabled || values.eventId)) {
        try {
          const eventData = googleCalendarService.taskToCalendarEvent(taskData);
          if (values.eventId) {
            // Actualizar
            const updatedEvent = await googleCalendarService.updateEvent(
              values.eventId,
              eventData,
              values.calendarId || 'primary'
            );
            taskData.eventId = updatedEvent.id;
            taskData.calendarId = updatedEvent.calendarId || 'primary';
          } else {
            // Crear
            const newEvent = await googleCalendarService.createEvent(eventData, 'primary');
            taskData.eventId = newEvent.id;
            taskData.calendarId = 'primary';
          }
        } catch (err) {
          console.error('Error al sincronizar con Google Calendar:', err);
        }
      }

      onSubmit(taskData);
      onClose();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 overflow-hidden flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {initialValues ? 'Editar Tarea' : 'Crear Nueva Tarea'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
                  <Stack spacing="lg">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <Tag size={16} className="mr-2 text-blue-600" />
                        Título <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        {...form.getInputProps('title')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el título de la tarea"
                      />
                      {form.errors.title && (
                        <p className="mt-1 text-sm text-red-500">{form.errors.title}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Tag size={16} className="mr-2 text-blue-600" />
                          Tipo de tarea <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          {...form.getInputProps('type')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccione el tipo</option>
                          {mockTaskTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        {form.errors.type && (
                          <p className="mt-1 text-sm text-red-500">{form.errors.type}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <User size={16} className="mr-2 text-blue-600" />
                          Asignado a <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          {...form.getInputProps('assignedTo')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccione un usuario</option>
                          {mockUsers.map(user => (
                            <option key={user.value} value={user.value}>{user.label}</option>
                          ))}
                        </select>
                        {form.errors.assignedTo && (
                          <p className="mt-1 text-sm text-red-500">{form.errors.assignedTo}</p>
                        )}
                      </div>
                    </div>

                    {/* Fecha y hora separados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Calendar size={16} className="mr-2 text-blue-600" />
                          Fecha
                        </label>
                        <DatePicker
                          value={selectedDate}
                          onChange={setSelectedDate}
                          minDate={new Date()}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Clock size={16} className="mr-2 text-blue-600" />
                          Hora
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <select 
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                            className="flex-1 py-2 px-2 border-none focus:ring-0 text-center appearance-none"
                          >
                            {hourOptions.map(hour => (
                              <option key={`hour-${hour}`} value={hour}>{hour}</option>
                            ))}
                          </select>
                          <span className="text-gray-500">:</span>
                          <select 
                            value={selectedMinute}
                            onChange={(e) => setSelectedMinute(e.target.value)}
                            className="flex-1 py-2 px-2 border-none focus:ring-0 text-center appearance-none"
                          >
                            {minuteOptions.map(minute => (
                              <option key={`minute-${minute}`} value={minute}>{minute}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Estado
                        </label>
                        <select
                          {...form.getInputProps('status')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En progreso</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Prioridad
                        </label>
                        <select
                          {...form.getInputProps('priority')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="high">Alta</option>
                          <option value="medium">Media</option>
                          <option value="low">Baja</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <MessageSquare size={16} className="mr-2 text-blue-600" />
                        Descripción
                      </label>
                      <textarea
                        {...form.getInputProps('description')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describa los detalles de la tarea"
                        rows={3}
                      />
                    </div>

                    {/* Opciones adicionales */}
                    <Box className="bg-blue-50 p-4 rounded-xl mt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Opciones adicionales
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="reminderEnabled"
                              checked={form.values.reminderEnabled}
                              onChange={(e) => form.setFieldValue('reminderEnabled', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <label htmlFor="reminderEnabled" className="text-gray-700">
                              Agregar recordatorio
                            </label>
                          </div>
                          {form.values.reminderEnabled && (
                            <div className="mt-2 ml-6">
                              <select
                                {...form.getInputProps('reminderTime')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              >
                                <option value="5">5 minutos antes</option>
                                <option value="15">15 minutos antes</option>
                                <option value="30">30 minutos antes</option>
                                <option value="60">1 hora antes</option>
                                <option value="1440">1 día antes</option>
                              </select>
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id="addToCalendar"
                              checked={form.values.addToCalendar}
                              onChange={(e) => form.setFieldValue('addToCalendar', e.target.checked)}
                              disabled={!isGCalEnabled && !initialValues?.eventId}
                              className="rounded border-gray-300 text-blue-600 mr-2"
                            />
                            <label htmlFor="addToCalendar" className="text-gray-700">
                              Sincronizar con Google Calendar
                            </label>
                          </div>

                          {!isGCalEnabled && !initialValues?.eventId && (
                            <div className="ml-6">
                              <Button
                                variant="light"
                                size="sm"
                                leftIcon={<Calendar size={16} />}
                                onClick={handleConnectGoogleCalendar}
                                loading={isGCalAuthorizing}
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                              >
                                Conectar con Google Calendar
                              </Button>
                              {calendarError && (
                                <p className="mt-2 text-sm text-red-500">{calendarError}</p>
                              )}
                            </div>
                          )}

                          {(isGCalEnabled || initialValues?.eventId) && (
                            <div className="ml-6 flex items-center text-sm text-green-600">
                              <Check size={16} className="mr-1" />
                              {initialValues?.eventId
                                ? 'Esta tarea ya está sincronizada con Google Calendar'
                                : 'Listo para sincronizar con Google Calendar'}
                            </div>
                          )}
                        </div>
                      </div>
                    </Box>
                  </Stack>
                </form>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={form.onSubmit(handleSubmit)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-600"
                >
                  {isSubmitting ? 'Guardando...' : initialValues ? 'Guardar cambios' : 'Crear tarea'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;