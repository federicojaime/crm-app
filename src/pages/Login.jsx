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
        apellido: 'Cannaviri',
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

      {/* Overlay gradiente usando grises corporativos */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background: 'linear-gradient(45deg, rgba(0,0,0,0.8), rgba(0,0,0,0.3))'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full z-10"
      >
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <div className="bg-white rounded-full inline-block shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <img
              src={logo}
              alt="Royal Prestige Logo"
              className="w-24 h-24 object-contain"
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

        {/* Login Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg shadow-xl p-8"
          style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  color: 'rgba(0,0,0,0.7)'
                }}
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1"
                style={{ color: 'rgba(0,0,0,0.7)' }}>
                Usuario
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md border transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderColor: 'rgba(0,0,0,0.2)'
                }}
                placeholder="Ingrese su usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1"
                style={{ color: 'rgba(0,0,0,0.7)' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderColor: 'rgba(0,0,0,0.2)'
                  }}
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'rgba(0,0,0,0.5)' }}
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
                  className="h-4 w-4 border rounded"
                  style={{
                    borderColor: 'rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(0,0,0,0.02)'
                  }}
                />
                <label className="ml-2 block text-sm" style={{ color: 'rgba(0,0,0,0.7)' }}>
                  Recordarme
                </label>
              </div>
              <div>
                <a href="#" className="text-sm hover:underline"
                  style={{ color: 'rgba(0,0,0,0.6)' }}>
                  Olvidé mi contraseña
                </a>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 rounded-md text-white transition-all duration-200"
              style={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Iniciar sesión
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Credenciales de prueba: admin / admin123
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;