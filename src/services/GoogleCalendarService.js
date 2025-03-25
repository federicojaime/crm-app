// src/services/GoogleCalendarService.js
/**
 * Servicio para manejar la integración con Google Calendar API
 */

// Credenciales de OAuth 2.0 para la API de Google
// Estas credenciales deberán obtenerse desde Google Cloud Console
const API_KEY = 'AIzaSyBtxAaYu5Di85H_4K1P2owyIjKIYF22BmQ';
const CLIENT_ID = '620684765683-4fg2m2099v9mff0e9d7ttcc262pfag58.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar';

class GoogleCalendarService {
  constructor() {
    this.isInitialized = false;
    this.isAuthorized = false;
    this.tokenClient = null;
  }

  /**
   * Inicializa la API de Google Calendar
   */
  async init() {
    if (this.isInitialized) return Promise.resolve();

    return new Promise((resolve, reject) => {
      // Carga el script de la API de Google
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: DISCOVERY_DOCS,
            });

            // Carga el script de autenticación de Google
            const scriptAuth = document.createElement('script');
            scriptAuth.src = 'https://accounts.google.com/gsi/client';
            scriptAuth.onload = () => {
              this.tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response) => {
                  if (response.error) {
                    reject(response);
                    return;
                  }
                  
                  this.isAuthorized = true;
                  resolve();
                },
              });
              
              this.isInitialized = true;
              resolve();
            };
            
            document.body.appendChild(scriptAuth);
          } catch (error) {
            reject(error);
          }
        });
      };
      
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  /**
   * Solicita autorización al usuario para acceder a su calendario
   */
  async authorize() {
    if (!this.isInitialized) {
      await this.init();
    }

    if (this.isAuthorized) return Promise.resolve();

    return new Promise((resolve) => {
      this.tokenClient.callback = (response) => {
        if (response.error) {
          console.error('Error de autorización:', response.error);
        }
        
        this.isAuthorized = true;
        resolve();
      };
      
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  /**
   * Revoca la autorización del usuario
   */
  async signOut() {
    if (!this.isInitialized || !this.isAuthorized) return Promise.resolve();

    return new Promise((resolve) => {
      const token = window.gapi.client.getToken();
      if (token) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
          window.gapi.client.setToken('');
          this.isAuthorized = false;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Obtiene la lista de calendarios del usuario
   */
  async getCalendarList() {
    if (!this.isAuthorized) {
      await this.authorize();
    }

    try {
      const response = await window.gapi.client.calendar.calendarList.list();
      return response.result.items;
    } catch (error) {
      console.error('Error al obtener la lista de calendarios:', error);
      throw error;
    }
  }

  /**
   * Obtiene eventos de un calendario específico
   * @param {string} calendarId - ID del calendario (primary por defecto)
   * @param {Object} options - Opciones de filtrado de eventos
   */
  async getEvents(calendarId = 'primary', options = {}) {
    if (!this.isAuthorized) {
      await this.authorize();
    }

    const timeMin = options.timeMin || new Date().toISOString();
    const maxResults = options.maxResults || 10;
    const singleEvents = options.singleEvents !== undefined ? options.singleEvents : true;

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId,
        timeMin,
        maxResults,
        singleEvents,
        orderBy: 'startTime',
      });
      
      return response.result.items;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo evento en el calendario
   * @param {Object} eventData - Datos del evento a crear
   * @param {string} calendarId - ID del calendario (primary por defecto)
   */
  async createEvent(eventData, calendarId = 'primary') {
    if (!this.isAuthorized) {
      await this.authorize();
    }

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId,
        resource: eventData,
      });
      
      return response.result;
    } catch (error) {
      console.error('Error al crear el evento:', error);
      throw error;
    }
  }

  /**
   * Actualiza un evento existente
   * @param {string} eventId - ID del evento a actualizar
   * @param {Object} eventData - Nuevos datos del evento
   * @param {string} calendarId - ID del calendario (primary por defecto)
   */
  async updateEvent(eventId, eventData, calendarId = 'primary') {
    if (!this.isAuthorized) {
      await this.authorize();
    }

    try {
      const response = await window.gapi.client.calendar.events.update({
        calendarId,
        eventId,
        resource: eventData,
      });
      
      return response.result;
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      throw error;
    }
  }

  /**
   * Elimina un evento existente
   * @param {string} eventId - ID del evento a eliminar
   * @param {string} calendarId - ID del calendario (primary por defecto)
   */
  async deleteEvent(eventId, calendarId = 'primary') {
    if (!this.isAuthorized) {
      await this.authorize();
    }

    try {
      await window.gapi.client.calendar.events.delete({
        calendarId,
        eventId,
      });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      throw error;
    }
  }

  /**
   * Convierte un objeto de tarea a formato de evento de Google Calendar
   * @param {Object} task - Objeto de tarea de la aplicación
   */
  taskToCalendarEvent(task) {
    // Asegurarse de que la fecha es un objeto Date
    const dueDate = new Date(task.dueDate);
    
    // Calcular la fecha de finalización (por defecto 1 hora después)
    const endDate = new Date(dueDate);
    endDate.setHours(endDate.getHours() + 1);
    
    // Construir el evento para Google Calendar
    return {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: dueDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: true,
      },
    };
  }
}

// Exportar una instancia única del servicio
export const googleCalendarService = new GoogleCalendarService();