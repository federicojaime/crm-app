// src/services/GoogleCalendarService.js
/**
 * Servicio para integrar con Google Calendar usando la librería Google Identity Services (GSI)
 * y la API de gapi para Calendar.
 *
 * En producción, usa variables de entorno (ej. process.env.REACT_APP_GOOGLE_API_KEY)
 * y NO expongas tus claves directamente en el código.
 */
const API_KEY = "AIzaSyBtxAaYu5Di85H_4K1P2owyIjKIYF22BmQ";
const CLIENT_ID = "620684765683-4fg2m2099v9mff0e9d7ttcc262pfag58.apps.googleusercontent.com";

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

class GoogleCalendarService {
  constructor() {
    this.isInitialized = false;
    this.isAuthorized = false;
    this.tokenClient = null;
    this.gapi = null;
  }

  async init() {
    if (this.isInitialized) return Promise.resolve();

    // 1) Cargar gapi
    await new Promise((resolve, reject) => {
      window.handleGapiLoaded = () => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: DISCOVERY_DOCS,
            });
            this.gapi = window.gapi;
            this.isInitialized = true;
            resolve();
          } catch (error) {
            console.error('Error inicializando GAPI client:', error);
            reject(error);
          }
        });
      };
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js?onload=handleGapiLoaded';
      script.async = true;
      script.defer = true;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    // 2) Cargar Google Identity Services
    await new Promise((resolve, reject) => {
      window.handleGisLoaded = () => {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            if (tokenResponse.error) {
              console.error('Error de token:', tokenResponse);
              return;
            }
            this.gapi.client.setToken({ access_token: tokenResponse.access_token });
            this.isAuthorized = true;
          },
        });
        resolve();
      };
      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.async = true;
      gisScript.defer = true;
      gisScript.onload = () => {
        window.handleGisLoaded();
      };
      gisScript.onerror = reject;
      document.body.appendChild(gisScript);
    });
  }

  async authorize() {
    if (!this.isInitialized) {
      await this.init();
    }
    if (this.isAuthorized) return Promise.resolve();

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
        const checkAuth = () => {
          if (this.isAuthorized) {
            resolve();
          } else {
            setTimeout(checkAuth, 100);
          }
        };
        checkAuth();
      } catch (error) {
        console.error('Error durante autorización:', error);
        reject(error);
      }
    });
  }

  async createEvent(eventData, calendarId = 'primary') {
    if (!this.isAuthorized) {
      throw new Error('No estás autorizado con Google Calendar');
    }
    const response = await this.gapi.client.calendar.events.insert({
      calendarId,
      resource: eventData,
    });
    return response.result;
  }

  async updateEvent(eventId, eventData, calendarId = 'primary') {
    if (!this.isAuthorized) {
      throw new Error('No estás autorizado con Google Calendar');
    }
    const response = await this.gapi.client.calendar.events.update({
      calendarId,
      eventId,
      resource: eventData,
    });
    return response.result;
  }

  async deleteEvent(eventId, calendarId = 'primary') {
    if (!this.isAuthorized) {
      throw new Error('No estás autorizado con Google Calendar');
    }
    await this.gapi.client.calendar.events.delete({
      calendarId,
      eventId,
    });
    return true;
  }

  async getEvents(calendarId = 'primary', options = {}) {
    if (!this.isAuthorized) {
      return [];
    }
    const response = await this.gapi.client.calendar.events.list({
      calendarId,
      timeMin: options.timeMin || new Date().toISOString(),
      maxResults: options.maxResults || 50,
      singleEvents: options.singleEvents !== undefined ? options.singleEvents : true,
      orderBy: 'startTime',
    });
    return response.result.items || [];
  }

  // Convierte una "tarea" local en evento de Calendar
  taskToCalendarEvent(task) {
    const dueDate = new Date(task.dueDate);
    const endDate = new Date(dueDate);
    endDate.setHours(endDate.getHours() + 1);

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
        useDefault: !task.reminderEnabled,
        overrides: task.reminderEnabled
          ? [{ method: 'popup', minutes: parseInt(task.reminderTime, 10) }]
          : [],
      },
    };
  }
}

export const googleCalendarService = new GoogleCalendarService();
