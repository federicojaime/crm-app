// src/components/calendar/EventModal.jsx
import { useEffect, useState } from 'react';
import { Button, TextInput, Textarea, Stack, Group } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { googleCalendarService } from '../../services/GoogleCalendarService';

const EventModal = ({ isOpen, event, onClose, onUpdated, onDeleted }) => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    if (event) {
      // Cargar datos del evento
      setSummary(event.summary || '');
      setDescription(event.description || '');
      const start = event.start?.dateTime ? new Date(event.start.dateTime) : null;
      const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;
      if (start) {
        setStartDate(start);
        setStartTime(start);
      }
      if (end) {
        setEndDate(end);
        setEndTime(end);
      }
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleClose = () => {
    onClose?.();
  };

  const handleSave = async () => {
    try {
      const combinedStart = new Date(startDate);
      combinedStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

      const combinedEnd = new Date(endDate);
      combinedEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

      const updatedEventData = {
        summary,
        description,
        start: {
          dateTime: combinedStart.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: combinedEnd.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      // Llamar a updateEvent
      const calendarId = event.organizer?.email || 'primary';
      const result = await googleCalendarService.updateEvent(event.id, updatedEventData, calendarId);

      onUpdated?.(result);
      handleClose();
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este evento?')) return;
    try {
      const calendarId = event.organizer?.email || 'primary';
      await googleCalendarService.deleteEvent(event.id, calendarId);
      onDeleted?.(event.id);
      handleClose();
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
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
            onClick={handleClose}
            style={{ backdropFilter: 'blur(2px)' }}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, translateY: '20px' }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: '20px' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-md z-50 rounded-xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-blue-600 text-white rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Editar Evento</h2>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto">
              <Stack spacing="md">
                <TextInput
                  label="Título"
                  placeholder="Resumen del evento"
                  value={summary}
                  onChange={(e) => setSummary(e.currentTarget.value)}
                />

                <Textarea
                  label="Descripción"
                  placeholder="Detalles del evento"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />

                {/* Fecha y hora de inicio */}
                <Group grow>
                  <DatePicker
                    label="Fecha de inicio"
                    value={startDate}
                    onChange={setStartDate}
                  />
                  <TimeInput
                    label="Hora de inicio"
                    format="24"
                    value={startTime}
                    onChange={setStartTime}
                  />
                </Group>

                {/* Fecha y hora de fin */}
                <Group grow>
                  <DatePicker
                    label="Fecha de fin"
                    value={endDate}
                    onChange={setEndDate}
                  />
                  <TimeInput
                    label="Hora de fin"
                    format="24"
                    value={endTime}
                    onChange={setEndTime}
                  />
                </Group>
              </Stack>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-2 p-4 border-t border-gray-100">
              <Button variant="outline" color="red" onClick={handleDelete}>
                Eliminar
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Guardar</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
