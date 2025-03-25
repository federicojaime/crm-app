// src/components/calendar/CalendarView.jsx
import { useState, useEffect } from 'react';
import { Box, Button, Group, Text, Loader, Paper, Tooltip } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { googleCalendarService } from '../../services/GoogleCalendarService';
import EventModal from './EventModal';

// Saber si una fecha es "hoy"
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const CalendarView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [visibleDates, setVisibleDates] = useState([]);

  // Para abrir el modal de edición
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const loadCalendarEvents = async () => {
    setIsLoading(true);
    try {
      // Autorizar si no está
      await googleCalendarService.authorize();

      // Traer eventos de este mes
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const googleEvents = await googleCalendarService.getEvents('primary', {
        timeMin: startOfMonth.toISOString(),
        maxResults: 100,
        singleEvents: true,
      });
      setEvents(googleEvents || []);
    } catch (error) {
      console.error('Error al obtener eventos de Google Calendar:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Crear la grilla de 42 celdas (7x6)
  const prepareCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Ajuste para lunes=0 ... domingo=6
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const datesArray = [];
    for (let i = 0; i < 42; i++) {
      const dayIndex = i - startOffset + 1;
      const dateObj = new Date(year, month, dayIndex);

      let dayEvents = [];
      if (dayIndex > 0 && dayIndex <= daysInMonth) {
        // Filtrar eventos
        dayEvents = events.filter((ev) => {
          if (!ev.start?.dateTime) return false;
          const evDate = new Date(ev.start.dateTime);
          return (
            evDate.getDate() === dateObj.getDate() &&
            evDate.getMonth() === dateObj.getMonth() &&
            evDate.getFullYear() === dateObj.getFullYear()
          );
        });
      }

      datesArray.push({
        date: dateObj,
        day: dayIndex > 0 && dayIndex <= daysInMonth ? dayIndex : null,
        events: dayEvents,
      });
    }
    setVisibleDates(datesArray);
  };

  // Al cambiar el mes, recarga
  useEffect(() => {
    loadCalendarEvents();
    // eslint-disable-next-line
  }, [currentDate]);

  // Al cambiar los eventos, recalcula la grilla
  useEffect(() => {
    prepareCalendarDates();
    // eslint-disable-next-line
  }, [events]);

  const handleEventClick = (ev) => {
    setSelectedEvent(ev);
    setIsEventModalOpen(true);
  };

  // Al guardar cambios en EventModal
  const handleEventUpdated = () => {
    loadCalendarEvents();
  };

  // Al eliminar
  const handleEventDeleted = (deletedEventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== deletedEventId));
  };

  return (
    <Box className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <Group spacing="xs">
          <Button
            variant="subtle"
            leftIcon={<ChevronLeft size={16} />}
            onClick={() => changeMonth(-1)}
          >
            Mes anterior
          </Button>
          <Text weight={600} size="xl" className="mx-4 capitalize">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </Text>
          <Button
            variant="subtle"
            rightIcon={<ChevronRight size={16} />}
            onClick={() => changeMonth(1)}
          >
            Mes siguiente
          </Button>
        </Group>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <Loader color="blue" size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {/* Encabezado días */}
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700">
              {day}
            </div>
          ))}

          {/* Celdas */}
          {visibleDates.map((cell, index) => (
            <Paper
              key={index}
              className={`min-h-[80px] p-1 border ${
                cell.day && isToday(cell.date)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="text-sm font-medium mb-1">{cell.day ? cell.day : ''}</Text>
              <div className="space-y-1">
                {cell.events.map((ev) => (
                  <Tooltip key={ev.id} label={ev.summary} position="top" withArrow>
                    <div
                      onClick={() => handleEventClick(ev)}
                      className="text-xs px-1 py-0.5 rounded bg-blue-100 text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                    >
                      {ev.start?.dateTime
                        ? new Date(ev.start.dateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                      {' - '}
                      {ev.summary}
                    </div>
                  </Tooltip>
                ))}
              </div>
            </Paper>
          ))}
        </div>
      )}

      {/* Modal de edición/eliminación */}
      <EventModal
        isOpen={isEventModalOpen}
        event={selectedEvent}
        onClose={() => setIsEventModalOpen(false)}
        onUpdated={handleEventUpdated}
        onDeleted={handleEventDeleted}
      />
    </Box>
  );
};

export default CalendarView;
