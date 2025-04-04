import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import fondo from "../assets/login.jpg";
import logo from "../assets/logo_login.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        nombre: 'Gimena',
        apellido: 'Gonzalez',
        email: formData.email
      }));
      navigate('/');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)'
        }}
      />

      {/* Overlay gradiente */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background: 'linear-gradient(45deg, rgba(21, 87, 153, 0.75), rgba(0, 51, 102, 0.4))'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 text-center"
        >
          <div className="bg-white rounded-full inline-block shadow-lg p-3">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-2xl font-bold text-white"
          >
            Sistema Administrativo
          </motion.h2>
        </motion.div>

        {/* Login Form with Glassmorphism */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl shadow-xl p-8 backdrop-blur-lg bg-white/20 border border-white/30"
          style={{
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-md text-sm text-white bg-red-500/30 backdrop-blur-sm border border-red-500/50"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Usuario
              </label>
              <div className="relative">
                {/* Icono con un círculo de fondo para hacerlo más visible */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="bg-blue-500 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-white/30 text-white placeholder-white/60 transition-all"
                  placeholder="Ingrese su usuario"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Contraseña
              </label>
              <div className="relative">
                {/* Icono con un círculo de fondo para hacerlo más visible */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="bg-blue-500 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:bg-white/30 text-white placeholder-white/60 transition-all"
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs transition-colors"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="h-4 w-4 bg-white/20 border-white/50 rounded focus:ring-blue-400 text-blue-500"
                />
                <label className="ml-2 block text-sm text-white">
                  Recordarme
                </label>
              </div>
              <div>
                <a href="#" className="text-sm text-blue-200 hover:text-blue-100 transition-colors">
                  Olvidé mi contraseña
                </a>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: "0px 0px 15px rgba(66, 153, 225, 0.6)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-blue-500 rounded-lg text-white font-medium shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600"
              style={{
                background: 'linear-gradient(to right, #4299e1, #3182ce)'
              }}
            >
              Iniciar sesión
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-white pt-4 border-t border-white/20">
            <p>Credenciales de prueba: admin / admin123</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;