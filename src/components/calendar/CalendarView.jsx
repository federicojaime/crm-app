// src/components/calendar/CalendarView.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Group,
  Text,
  Loader,
  Alert,
  Tooltip,
  Badge,
  ActionIcon,
  Modal,
  Title,
  Card,
  Grid,
  Divider,
  Paper
} from '@mantine/core';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Clock
} from 'lucide-react';
import { googleCalendarService } from '../../services/GoogleCalendarService';

// Color palette para los eventos según la primera letra del título
const colorPalette = [
  { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
];

const getEventColor = (title) => {
  if (!title) return colorPalette[0];
  const firstChar = title.charAt(0).toLowerCase();
  const index = firstChar.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

const CalendarView = ({ tasks = [], onSyncTask, onEditTask }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [visibleDates, setVisibleDates] = useState([]);

  // Inicializar Google Calendar API
  useEffect(() => {
    const initCalendar = async () => {
      try {
        await googleCalendarService.init();
        setIsAuthenticated(googleCalendarService.isAuthorized);
        if (googleCalendarService.isAuthorized) {
          fetchEvents();
        }
      } catch (err) {
        console.error('Error al inicializar Google Calendar:', err);
        setError('No se pudo inicializar la integración con Google Calendar');
      }
    };

    initCalendar();
    generateVisibleDates(currentDate);
  }, []);

  // Generar los días visibles para el calendario
  const generateVisibleDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Crear array con todos los días del mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      dates.push({
        date: currentDate,
        day: i,
        weekday: currentDate.toLocaleDateString('es-ES', { weekday: 'short' }),
        isToday: isToday(currentDate),
        events: []
      });
    }
    
    setVisibleDates(dates);
  };

  // Verificar si una fecha es hoy
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Función para autenticar con Google
  const handleAuthenticate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await googleCalendarService.authorize();
      setIsAuthenticated(true);
      fetchEvents();
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError('Error al autenticar con Google. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      await googleCalendarService.signOut();
      setIsAuthenticated(false);
      setEvents([]);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError('Error al cerrar sesión de Google.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar mes
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    generateVisibleDates(newDate);
    fetchEvents(newDate);
  };

  // Obtener eventos del calendario
  const fetchEvents = useCallback(async (date = currentDate) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Configurar rango de fechas para el mes actual
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const eventList = await googleCalendarService.getEvents('primary', {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        maxResults: 100,
      });
      
      setEvents(eventList);
      
      // Asignar eventos a días visibles
      const updatedDates = [...visibleDates];
      updatedDates.forEach(dateObj => {
        dateObj.events = eventList.filter(event => {
          const eventDate = new Date(event.start.dateTime || event.start.date);
          return eventDate.getDate() === dateObj.date.getDate() &&
                 eventDate.getMonth() === dateObj.date.getMonth();
        });
      });
      
      setVisibleDates(updatedDates);
      
    } catch (err) {
      console.error('Error al obtener eventos:', err);
      setError('No se pudieron cargar los eventos del calendario.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentDate, visibleDates]);

  // Abrir detalles del evento
  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Si no está autorizado, mostrar pantalla de conexión
  if (!isAuthenticated) {
    return (
      <Box className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center flex-col p-10 bg-gray-50 rounded-lg">
          <Calendar size={48} className="text-blue-500 mb-4" />
          <Title order={3} className="text-center mb-2">Conecta con Google Calendar</Title>
          <Text className="text-center text-gray-600 max-w-md mb-6">
            Conecta tu cuenta de Google para ver y gestionar tus eventos directamente desde esta aplicación.
          </Text>
          <Button
            color="red"
            size="md"
            className="font-medium"
            onClick={handleAuthenticate}
            loading={isLoading}
          >
            Conectar con Google Calendar
          </Button>
          
          {error && (
            <Alert color="red" className="mt-6 max-w-md">
              <Group>
                <AlertCircle size={18} />
                <Text size="sm">{error}</Text>
              </Group>
            </Alert>
          )}
        </div>
      </Box>
    );
  }

  // Renderizado del calendario
  return (
    <Box className="bg-white rounded-lg shadow-md">
      {/* Cabecera con controles de navegación */}
      <Box className="p-4 border-b border-gray-200 flex justify-between items-center">
        <Group>
          <Button 
            variant="subtle" 
            leftIcon={<ChevronLeft size={16} />}
            onClick={() => changeMonth(-1)}
          >
            Mes anterior
          </Button>
          <Text weight={600} size="xl" className="mx-4">
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
        
        <Group>
          <Tooltip label="Actualizar eventos">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => fetchEvents()}
              loading={isLoading}
            >
              <RefreshCw size={18} />
            </ActionIcon>
          </Tooltip>
          
          <Button
            variant="outline"
            color="red"
            size="xs"
            onClick={handleSignOut}
          >
            Cerrar sesión
          </Button>
          
          <Button
            variant="outline"
            size="xs"
            rightIcon={<ExternalLink size={14} />}
            component="a"
            href="https://calendar.google.com/"
            target="_blank"
          >
            Abrir en Google
          </Button>
        </Group>
      </Box>

      {/* Mostrar error si existe */}
      {error && (
        <Alert color="red" className="m-4">
          <Group>
            <AlertCircle size={18} />
            <div>
              <Text size="sm">{error}</Text>
              <Button 
                variant="subtle" 
                color="red" 
                size="xs" 
                className="mt-2"
                onClick={() => fetchEvents()}
              >
                Reintentar
              </Button>
            </div>
          </Group>
        </Alert>
      )}

      {/* Vista principal del calendario */}
      <Box className="p-4">
        {isLoading && events.length === 0 ? (
          <div className="flex justify-center items-center p-10">
            <Loader color="blue" />
          </div>
        ) : (
          <>
            {/* Cabecera de los días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center font-medium">
              <div className="p-2">Lun</div>
              <div className="p-2">Mar</div>
              <div className="p-2">Mié</div>
              <div className="p-2">Jue</div>
              <div className="p-2">Vie</div>
              <div className="p-2">Sáb</div>
              <div className="p-2">Dom</div>
            </div>
            
            {/* Grid del calendario */}
            <div className="grid grid-cols-7 gap-1">
              {/* Espacios vacíos para ajustar el primer día del mes */}
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() || 7 }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[100px] p-1 bg-gray-50 rounded-md"></div>
              ))}
              
              {/* Días del mes */}
              {visibleDates.map((dateObj) => (
                <Paper
                  key={dateObj.day}
                  className={`min-h-[100px] p-1 rounded-md overflow-hidden border ${
                    dateObj.isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className={`text-sm font-medium p-1 ${
                    dateObj.isToday ? 'text-blue-700' : ''
                  }`}>
                    {dateObj.day}
                  </div>
                  
                  <div className="space-y-1 max-h-[80px] overflow-y-auto">
                    {dateObj.events.map((event, idx) => {
                      const colorStyle = getEventColor(event.summary);
                      return (
                        <div
                          key={`${event.id}-${idx}`}
                          className={`text-xs p-1 rounded cursor-pointer ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border} border truncate`}
                          onClick={() => openEventDetails(event)}
                        >
                          {event.start.dateTime && (
                            <span className="mr-1 font-medium">
                              {new Date(event.start.dateTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                          {event.summary}
                        </div>
                      );
                    })}
                  </div>
                </Paper>
              ))}
            </div>
          </>
        )}
      </Box>

      {/* Modal de detalles del evento */}
      <Modal
        opened={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        title="Detalles del evento"
        size="md"
      >
        {selectedEvent && (
          <div>
            <Title order={4}>{selectedEvent.summary}</Title>
            
            <Divider className="my-3" />
            
            <Grid>
              <Grid.Col span={4} className="font-medium text-gray-600">Fecha:</Grid.Col>
              <Grid.Col span={8}>
                {new Date(selectedEvent.start.dateTime || selectedEvent.start.date).toLocaleDateString()}
              </Grid.Col>
              
              {selectedEvent.start.dateTime && (
                <>
                  <Grid.Col span={4} className="font-medium text-gray-600">Hora:</Grid.Col>
                  <Grid.Col span={8}>
                    {new Date(selectedEvent.start.dateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {' - '}
                    {new Date(selectedEvent.end.dateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Grid.Col>
                </>
              )}
              
              {selectedEvent.location && (
                <>
                  <Grid.Col span={4} className="font-medium text-gray-600">Ubicación:</Grid.Col>
                  <Grid.Col span={8}>{selectedEvent.location}</Grid.Col>
                </>
              )}
              
              {selectedEvent.description && (
                <>
                  <Grid.Col span={12} className="font-medium text-gray-600">Descripción:</Grid.Col>
                  <Grid.Col span={12} className="bg-gray-50 p-3 rounded">
                    {selectedEvent.description}
                  </Grid.Col>
                </>
              )}
            </Grid>
            
            <Divider className="my-3" />
            
            <Group position="right">
              {/* Botón para abrir en Google Calendar */}
              <Button
                variant="outline"
                rightIcon={<ExternalLink size={16} />}
                component="a"
                href={selectedEvent.htmlLink}
                target="_blank"
              >
                Ver en Google Calendar
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </Box>
  );
};

export default CalendarView;