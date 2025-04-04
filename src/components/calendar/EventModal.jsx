// src/components/calendar/EventModal.jsx
import { useEffect, useState } from 'react';
import { Button, TextInput, Textarea, Stack, Group } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Check, Save, Trash } from 'lucide-react';
import { googleCalendarService } from '../../services/GoogleCalendarService';

const EventModal = ({ isOpen, event, onClose, onUpdated, onDeleted }) => {
  // Estado principal
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  
  // Estados separados para fecha y hora
  const [startDate, setStartDate] = useState(new Date());
  const [startHour, setStartHour] = useState('12');
  const [startMinute, setStartMinute] = useState('00');
  
  const [endDate, setEndDate] = useState(new Date());
  const [endHour, setEndHour] = useState('13');
  const [endMinute, setEndMinute] = useState('00');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Opciones para los selectores de hora y minuto
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  const minuteOptions = ['00', '15', '30', '45'];

  // Cargar datos del evento cuando se abre el modal
  useEffect(() => {
    if (event) {
      // Cargar título y descripción
      setSummary(event.summary || '');
      setDescription(event.description || '');
      
      // Procesar fecha y hora de inicio
      if (event.start?.dateTime) {
        const startDateTime = new Date(event.start.dateTime);
        setStartDate(startDateTime);
        setStartHour(startDateTime.getHours().toString().padStart(2, '0'));
        setStartMinute(startDateTime.getMinutes().toString().padStart(2, '0'));
      } else {
        const now = new Date();
        setStartDate(now);
        setStartHour(now.getHours().toString().padStart(2, '0'));
        setStartMinute(now.getMinutes().toString().padStart(2, '0'));
      }
      
      // Procesar fecha y hora de fin
      if (event.end?.dateTime) {
        const endDateTime = new Date(event.end.dateTime);
        setEndDate(endDateTime);
        setEndHour(endDateTime.getHours().toString().padStart(2, '0'));
        setEndMinute(endDateTime.getMinutes().toString().padStart(2, '0'));
      } else {
        const later = new Date();
        later.setHours(later.getHours() + 1);
        setEndDate(later);
        setEndHour(later.getHours().toString().padStart(2, '0'));
        setEndMinute(later.getMinutes().toString().padStart(2, '0'));
      }
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleClose = () => {
    setError(null);
    onClose?.();
  };

  // Función para combinar fecha y hora en un objeto Date
  const combineDateAndTime = (date, hour, minute) => {
    const result = new Date(date);
    result.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
    return result;
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Combinar fecha y hora
      const combinedStart = combineDateAndTime(startDate, startHour, startMinute);
      const combinedEnd = combineDateAndTime(endDate, endHour, endMinute);

      // Validación básica
      if (!summary.trim()) {
        setError('El título es obligatorio');
        setIsSubmitting(false);
        return;
      }

      if (combinedEnd < combinedStart) {
        setError('La fecha/hora de finalización debe ser posterior a la de inicio');
        setIsSubmitting(false);
        return;
      }

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
      setError('No se pudo actualizar el evento. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro que deseas eliminar este evento?')) return;
    
    try {
      setIsSubmitting(true);
      const calendarId = event.organizer?.email || 'primary';
      await googleCalendarService.deleteEvent(event.id, calendarId);
      onDeleted?.(event.id);
      handleClose();
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      setError('No se pudo eliminar el evento. Inténtalo de nuevo.');
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
            <div className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
              
              <Stack spacing="md">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.currentTarget.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Título del evento"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detalles del evento"
                    rows={3}
                  />
                </div>

                {/* Fecha y hora de inicio (completamente separados) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      Fecha de inicio
                    </label>
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Clock size={16} className="mr-2 text-blue-600" />
                      Hora de inicio
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <select 
                        value={startHour}
                        onChange={(e) => setStartHour(e.target.value)}
                        className="flex-1 py-2 px-2 border-none focus:ring-0 text-center appearance-none"
                      >
                        {hourOptions.map(hour => (
                          <option key={`start-hour-${hour}`} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span className="text-gray-500">:</span>
                      <select 
                        value={startMinute}
                        onChange={(e) => setStartMinute(e.target.value)}
                        className="flex-1 py-2 px-2 border-none focus:ring-0 text-center appearance-none"
                      >
                        {minuteOptions.map(minute => (
                          <option key={`start-minute-${minute}`} value={minute}>{minute}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Fecha y hora de fin (completamente separados) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      Fecha de fin
                    </label>
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Clock size={16} className="mr-2 text-blue-600" />
                      Hora de fin
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <select 
                        value={endHour}
                        onChange={(e) => setEndHour(e.target.value)}
                        className="flex-1 py-2 px-2 border-none focus:ring-0 text-center appearance-none"
                      >
                        {hourOptions.map(hour => (
                          <option key={`end-hour-${hour}`} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span className="text-gray-500">:</span>
                      <select 
                        value={endMinute}
                        onChange={(e) => setEndMinute(e.target.value)}
                        className="flex-1 py-2 px-2 border-none focus:ring-0 text-center appearance-none"
                      >
                        {minuteOptions.map(minute => (
                          <option key={`end-minute-${minute}`} value={minute}>{minute}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Stack>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center gap-2 p-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                color="red" 
                onClick={handleDelete}
                leftIcon={<Trash size={16} />}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Eliminar
              </Button>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                
                <Button 
                  onClick={handleSave}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  leftIcon={<Save size={16} />}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventModal;