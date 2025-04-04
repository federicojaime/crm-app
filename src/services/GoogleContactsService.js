// src/services/GoogleContactsService.js
/**
 * Servicio para integrar con Google Contacts API utilizando la autenticación OAuth2
 * Similar al servicio de GoogleCalendarService pero para Contacts
 * 
 * IMPORTANTE: En producción, usar variables de entorno y no exponer claves API en el código
 */

// Utilizamos las mismas credenciales que para Google Calendar
const API_KEY = "AIzaSyBtxAaYu5Di85H_4K1P2owyIjKIYF22BmQ";
const CLIENT_ID = "620684765683-4fg2m2099v9mff0e9d7ttcc262pfag58.apps.googleusercontent.com";

// People API (para contactos) tiene un scope diferente
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'];
const SCOPES = 'https://www.googleapis.com/auth/contacts.readonly';

class GoogleContactsService {
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
      window.handleGapiContactsLoaded = () => {
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
            console.error('Error inicializando GAPI client para Google Contacts:', error);
            reject(error);
          }
        });
      };
      
      // Si el script ya está cargado (por el Calendar Service), solo inicializamos
      if (window.gapi) {
        window.handleGapiContactsLoaded();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js?onload=handleGapiContactsLoaded';
      script.async = true;
      script.defer = true;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    // 2) Cargar Google Identity Services (si no está cargado ya)
    if (!window.google?.accounts?.oauth2) {
      await new Promise((resolve, reject) => {
        window.handleGisContactsLoaded = () => {
          this.tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse) => {
              if (tokenResponse.error) {
                console.error('Error de token en Google Contacts:', tokenResponse);
                return;
              }
              this.gapi.client.setToken({ access_token: tokenResponse.access_token });
              this.isAuthorized = true;
            },
          });
          resolve();
        };
        
        if (window.google?.accounts?.oauth2) {
          window.handleGisContactsLoaded();
          return;
        }
        
        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.async = true;
        gisScript.defer = true;
        gisScript.onload = () => {
          window.handleGisContactsLoaded();
        };
        gisScript.onerror = reject;
        document.body.appendChild(gisScript);
      });
    } else {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('Error de token en Google Contacts:', tokenResponse);
            return;
          }
          this.gapi.client.setToken({ access_token: tokenResponse.access_token });
          this.isAuthorized = true;
        },
      });
    }
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
        console.error('Error durante autorización de Google Contacts:', error);
        reject(error);
      }
    });
  }

  async getContacts(pageSize = 100) {
    if (!this.isAuthorized) {
      throw new Error('No estás autorizado para acceder a Google Contacts');
    }

    try {
      // Llamada a People API para obtener contactos
      const response = await this.gapi.client.people.people.connections.list({
        resourceName: 'people/me',
        pageSize: pageSize,
        personFields: 'names,emailAddresses,phoneNumbers,organizations',
      });

      return this.formatContacts(response.result.connections || []);
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      throw error;
    }
  }

  formatContacts(googleContacts) {
    // Convertir el formato de Google Contacts al formato de nuestra aplicación
    return googleContacts.map(contact => {
      const name = contact.names?.[0]?.displayName || '';
      const nameParts = name.split(' ');
      const nombre = nameParts[0] || '';
      const apellido = nameParts.slice(1).join(' ') || '';
      
      return {
        id: `google_${contact.resourceName.split('/')[1]}`,
        nombre,
        apellido,
        email: contact.emailAddresses?.[0]?.value || '',
        telefono: contact.phoneNumbers?.[0]?.value || '',
        empresa: contact.organizations?.[0]?.name || '',
        source: 'Google Contacts',
        estado: 'Activo',
        lastContact: new Date().toISOString().substring(0, 10),
        fecha_creacion: new Date().toISOString().substring(0, 10),
        etapa: 'Prospecto',
        direccion: '',
      };
    });
  }
}

export const googleContactsService = new GoogleContactsService();