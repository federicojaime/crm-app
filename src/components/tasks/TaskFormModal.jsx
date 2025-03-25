// src/components/tasks/TaskFormModal.jsx
import { useState } from 'react';
import {
  Button,
  Select,
  TextInput,
  Textarea,
  Stack,
  Box,
  Checkbox,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Calendar, X, Check } from 'lucide-react';
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
  const [isGCalEnabled, setIsGCalEnabled] = useState(false);
  const [isGCalAuthorizing, setIsGCalAuthorizing] = useState(false);
  const [calendarError, setCalendarError] = useState(null);

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
      dueDate: (value) => (!value ? 'La fecha de vencimiento es requerida' : null),
    },
  });

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

  const handleSubmit = async (values) => {
    const dueDate = new Date(values.dueDate);
    const dueTime = new Date(values.dueTime);
    dueDate.setHours(dueTime.getHours(), dueTime.getMinutes(), 0, 0);

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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            style={{ backdropFilter: 'blur(2px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, translateY: '20px' }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: '20px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 rounded-xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {initialValues ? 'Editar tarea' : 'Crear nueva tarea'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="mt-1 text-blue-100 text-sm">
                {initialValues
                  ? 'Modifica los detalles de la tarea existente'
                  : 'Completa la información para crear una nueva tarea'}
              </p>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto">
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                  <TextInput
                    label="Título"
                    placeholder="Ingrese el título de la tarea"
                    required
                    size="md"
                    {...form.getInputProps('title')}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Tipo de tarea"
                      placeholder="Seleccione el tipo"
                      data={mockTaskTypes}
                      required
                      size="md"
                      {...form.getInputProps('type')}
                    />

                    <Select
                      label="Asignado a"
                      placeholder="Seleccione un usuario"
                      data={mockUsers}
                      required
                      size="md"
                      {...form.getInputProps('assignedTo')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                      label="Fecha de vencimiento"
                      placeholder="Seleccione la fecha"
                      required
                      size="md"
                      value={form.values.dueDate}
                      onChange={(date) => form.setFieldValue('dueDate', date)}
                      minDate={new Date()}
                    />
                    <TimeInput
                      label="Hora"
                      format="24"
                      value={form.values.dueTime}
                      onChange={(time) => form.setFieldValue('dueTime', time)}
                      size="md"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Estado"
                      placeholder="Seleccione el estado"
                      data={[
                        { value: 'pending', label: 'Pendiente' },
                        { value: 'in_progress', label: 'En progreso' },
                        { value: 'completed', label: 'Completada' },
                        { value: 'cancelled', label: 'Cancelada' },
                      ]}
                      size="md"
                      {...form.getInputProps('status')}
                    />
                    <Select
                      label="Prioridad"
                      placeholder="Seleccione la prioridad"
                      data={[
                        { value: 'high', label: 'Alta' },
                        { value: 'medium', label: 'Media' },
                        { value: 'low', label: 'Baja' },
                      ]}
                      size="md"
                      {...form.getInputProps('priority')}
                    />
                  </div>

                  <TextInput
                    label="Relacionado con"
                    placeholder="Cliente, proyecto o negocio"
                    size="md"
                    {...form.getInputProps('relatedTo')}
                  />

                  <Textarea
                    label="Descripción"
                    placeholder="Describa los detalles de la tarea"
                    minRows={3}
                    size="md"
                    {...form.getInputProps('description')}
                  />

                  {/* Opciones adicionales */}
                  <Box className="bg-blue-50 p-4 rounded-xl mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Opciones adicionales
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Checkbox
                          label="Agregar recordatorio"
                          size="md"
                          checked={form.values.reminderEnabled}
                          onChange={(event) =>
                            form.setFieldValue('reminderEnabled', event.currentTarget.checked)
                          }
                        />
                        {form.values.reminderEnabled && (
                          <div className="mt-2 ml-6">
                            <Select
                              size="sm"
                              label="Tiempo antes"
                              data={[
                                { value: '5', label: '5 minutos antes' },
                                { value: '15', label: '15 minutos antes' },
                                { value: '30', label: '30 minutos antes' },
                                { value: '60', label: '1 hora antes' },
                                { value: '1440', label: '1 día antes' },
                              ]}
                              {...form.getInputProps('reminderTime')}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center mb-2">
                          <Checkbox
                            label="Sincronizar con Google Calendar"
                            size="md"
                            checked={form.values.addToCalendar}
                            onChange={(event) =>
                              form.setFieldValue('addToCalendar', event.currentTarget.checked)
                            }
                            disabled={!isGCalEnabled && !initialValues?.eventId}
                          />
                        </div>

                        {!isGCalEnabled && !initialValues?.eventId && (
                          <div className="ml-6">
                            <Button
                              variant="light"
                              size="sm"
                              leftIcon={<Calendar size={16} />}
                              onClick={handleConnectGoogleCalendar}
                              loading={isGCalAuthorizing}
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

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="md" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="md" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {initialValues ? 'Guardar cambios' : 'Crear tarea'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
