// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <ShieldAlert size={48} className="text-red-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Acceso Denegado
                </h1>

                <p className="text-gray-600 text-center mb-6">
                    No tienes permiso para acceder a esta página. Por favor contacta al
                    administrador si crees que deberías tener acceso.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Home size={18} />
                        Ir al Inicio
                    </Link>

                    <button
                        onClick={() => history.back()}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Volver Atrás
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;