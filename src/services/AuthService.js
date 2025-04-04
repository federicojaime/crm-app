// src/services/AuthService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api-crm';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para añadir token en cada solicitud
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Guarda el token JWT en localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Obtiene el token JWT de localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Elimina el token JWT de localStorage
  removeToken() {
    localStorage.removeItem('token');
  }

  // Verifica si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(roleName) {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.includes(roleName);
  }

  // Almacena información del usuario en localStorage
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtiene información del usuario desde localStorage
  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Login de usuario
  async login(email, password) {
    try {
      const response = await this.api.post('/user/login', { email, password });
      if (response.data.ok && response.data.data) {
        // Guardar token y datos del usuario
        this.setToken(response.data.data.jwt);
        this.setUser(response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.msg || 'Error en el inicio de sesión');
    } catch (error) {
      throw error.response?.data?.msg || error.message || 'Error en el inicio de sesión';
    }
  }

  // Registro de usuario
  async register(userData) {
    try {
      const response = await this.api.post('/user/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.msg || error.message || 'Error en el registro';
    }
  }

  // Cierre de sesión
  logout() {
    this.removeToken();
    localStorage.removeItem('user');
  }

  // Recuperación de contraseña
  async recoverPassword(email) {
    try {
      const response = await this.api.post('/user/password/recover', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.msg || error.message || 'Error en la recuperación de contraseña';
    }
  }

  // Actualizar contraseña después de recuperación
  async updatePasswordWithToken(data) {
    try {
      const response = await this.api.patch('/user/password/temp/update', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.msg || error.message || 'Error al actualizar contraseña';
    }
  }

  // Obtener todos los roles
  async getAllRoles() {
    try {
      const response = await this.api.get('/roles');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.msg || error.message || 'Error al obtener roles';
    }
  }

  // Asignar roles a un usuario
  async assignRolesToUser(userId, roleIds) {
    try {
      const response = await this.api.post(`/user/${userId}/roles`, { roles: roleIds });
      return response.data;
    } catch (error) {
      throw error.response?.data?.msg || error.message || 'Error al asignar roles';
    }
  }
}

export default new AuthService();