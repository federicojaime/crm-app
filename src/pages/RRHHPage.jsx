// src/pages/RRHHPage.jsx
import { useState } from 'react';
import { 
  IconPlus, 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconPhone, 
  IconMail,
  IconCalendar,
  IconFilter,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { Button, Modal, TextInput, Textarea, Select, MultiSelect } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

// Modal para añadir/editar candidatos
const CandidateFormModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    fuente: '',
    puesto: '',
    estado: 'pendiente',
    notas: '',
    fechaContacto: new Date(),
    skills: []
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: formData.id || Date.now(),
      fechaCreacion: formData.fechaCreacion || new Date().toISOString()
    });
    onClose();
  };

  const posiciones = [
    { value: 'asesor_ventas', label: 'Asesor de Ventas' },
    { value: 'coordinador', label: 'Coordinador de Equipo' },
    { value: 'gerente', label: 'Gerente Comercial' },
    { value: 'asistente', label: 'Asistente Administrativo' },
    { value: 'capacitador', label: 'Capacitador' }
  ];

  const fuentesReclutamiento = [
    { value: 'referido', label: 'Referido' },
    { value: 'bolsa_trabajo', label: 'Bolsa de Trabajo' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'web', label: 'Sitio Web' },
    { value: 'evento', label: 'Evento' }
  ];

  const skillsOptions = [
    { value: 'ventas', label: 'Ventas' },
    { value: 'atencion_cliente', label: 'Atención al Cliente' },
    { value: 'negociacion', label: 'Negociación' },
    { value: 'trabajo_equipo', label: 'Trabajo en Equipo' },
    { value: 'proactividad', label: 'Proactividad' },
    { value: 'creatividad', label: 'Creatividad' },
    { value: 'adaptabilidad', label: 'Adaptabilidad' },
    { value: 'comunicacion', label: 'Comunicación' }
  ];

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Candidato" : "Nuevo Candidato"}
      size="lg"
    >
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Nombre"
            placeholder="Nombre del candidato"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            required
          />
          <TextInput
            label="Apellido"
            placeholder="Apellido del candidato"
            value={formData.apellido}
            onChange={(e) => handleChange('apellido', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Teléfono"
            placeholder="+54 9 11 1234-5678"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            required
          />
          <TextInput
            label="Email"
            placeholder="email@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Puesto"
            placeholder="Seleccione un puesto"
            data={posiciones}
            value={formData.puesto}
            onChange={(val) => handleChange('puesto', val)}
            required
          />
          <Select
            label="Fuente"
            placeholder="¿Cómo llegó a nosotros?"
            data={fuentesReclutamiento}
            value={formData.fuente}
            onChange={(val) => handleChange('fuente', val)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label="Fecha de contacto"
            value={formData.fechaContacto ? new Date(formData.fechaContacto) : new Date()}
            onChange={(val) => handleChange('fechaContacto', val)}
          />
          <Select
            label="Estado"
            placeholder="Estado del candidato"
            data={[
              { value: 'pendiente', label: 'Pendiente de llamar' },
              { value: 'contactado', label: 'Contactado' },
              { value: 'entrevista', label: 'En proceso de entrevista' },
              { value: 'seleccionado', label: 'Seleccionado' },
              { value: 'rechazado', label: 'Rechazado' }
            ]}
            value={formData.estado}
            onChange={(val) => handleChange('estado', val)}
            required
          />
        </div>

        <MultiSelect
          label="Habilidades"
          placeholder="Seleccione habilidades"
          data={skillsOptions}
          value={formData.skills || []}
          onChange={(val) => handleChange('skills', val)}
        />

        <Textarea
          label="Notas"
          placeholder="Notas sobre el candidato"
          minRows={3}
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </div>
    </Modal>
  );
};

// Componente principal de RRHH
export default function RRHHPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  // Estado para candidatos
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      telefono: '+54 9 11 2345-6789',
      email: 'carlos.rodriguez@email.com',
      puesto: 'asesor_ventas',
      fuente: 'referido',
      estado: 'pendiente',
      fechaContacto: new Date('2024-04-05').toISOString(),
      fechaCreacion: new Date('2024-04-01').toISOString(),
      notas: 'Referido por Juan Pérez. Tiene experiencia en ventas de 3 años.',
      skills: ['ventas', 'comunicacion', 'proactividad']
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'González',
      telefono: '+54 9 11 3456-7890',
      email: 'maria.gonzalez@email.com',
      puesto: 'coordinador',
      fuente: 'linkedin',
      estado: 'contactado',
      fechaContacto: new Date('2024-04-03').toISOString(),
      fechaCreacion: new Date('2024-03-28').toISOString(),
      notas: 'Experiencia previa en coordinación de equipos comerciales.',
      skills: ['ventas', 'trabajo_equipo', 'negociacion', 'comunicacion']
    },
    {
      id: 3,
      nombre: 'Luis',
      apellido: 'Sánchez',
      telefono: '+54 9 11 4567-8901',
      email: 'luis.sanchez@email.com',
      puesto: 'gerente',
      fuente: 'bolsa_trabajo',
      estado: 'entrevista',
      fechaContacto: new Date('2024-04-08').toISOString(),
      fechaCreacion: new Date('2024-04-02').toISOString(),
      notas: 'Segunda entrevista programada para el 15/04.',
      skills: ['ventas', 'negociacion', 'trabajo_equipo', 'proactividad', 'adaptabilidad']
    }
  ]);

  // Funciones para gestión de candidatos
  const handleSaveCandidate = (candidateData) => {
    if (currentCandidate) {
      // Actualizar candidato existente
      setCandidates(prev => 
        prev.map(c => c.id === candidateData.id ? candidateData : c)
      );
    } else {
      // Crear nuevo candidato
      setCandidates(prev => [...prev, candidateData]);
    }
  };

  const handleEditCandidate = (candidate) => {
    setCurrentCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleDeleteCandidate = (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    setConfirmDeleteId(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setCandidates(prev => 
      prev.map(c => c.id === id ? {...c, estado: newStatus} : c)
    );
  };

  // Filtros
  const filteredCandidates = candidates.filter(candidate => {
    const searchMatch = `${candidate.nombre} ${candidate.apellido} ${candidate.email}`.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter ? candidate.estado === filter : true;
    return searchMatch && filterMatch;
  });

  // Obtener nombres legibles
  const getStatusName = (statusCode) => {
    const statusMap = {
      'pendiente': 'Pendiente',
      'contactado': 'Contactado',
      'entrevista': 'En Entrevista',
      'seleccionado': 'Seleccionado',
      'rechazado': 'Rechazado'
    };
    return statusMap[statusCode] || statusCode;
  };

  const getPositionName = (positionCode) => {
    const positionMap = {
      'asesor_ventas': 'Asesor de Ventas',
      'coordinador': 'Coordinador de Equipo',
      'gerente': 'Gerente Comercial',
      'asistente': 'Asistente Administrativo',
      'capacitador': 'Capacitador'
    };
    return positionMap[positionCode] || positionCode;
  };

  const getSourceName = (sourceCode) => {
    const sourceMap = {
      'referido': 'Referido',
      'bolsa_trabajo': 'Bolsa de Trabajo',
      'linkedin': 'LinkedIn',
      'web': 'Sitio Web',
      'evento': 'Evento'
    };
    return sourceMap[sourceCode] || sourceCode;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'contactado': 'bg-blue-100 text-blue-800',
      'entrevista': 'bg-purple-100 text-purple-800',
      'seleccionado': 'bg-green-100 text-green-800',
      'rechazado': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getSkillNameFromValue = (skillValue) => {
    const skillsMap = {
      'ventas': 'Ventas',
      'atencion_cliente': 'Atención al Cliente',
      'negociacion': 'Negociación',
      'trabajo_equipo': 'Trabajo en Equipo',
      'proactividad': 'Proactividad',
      'creatividad': 'Creatividad',
      'adaptabilidad': 'Adaptabilidad',
      'comunicacion': 'Comunicación'
    };
    return skillsMap[skillValue] || skillValue;
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de RRHH</h1>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => {
              setCurrentCandidate(null);
              setIsFormOpen(true);
            }}
          >
            Nuevo Candidato
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-grow">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar candidatos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <Select
            placeholder="Filtrar por estado"
            icon={<IconFilter size={16} />}
            data={[
              { value: '', label: 'Todos los estados' },
              { value: 'pendiente', label: 'Pendiente de llamar' },
              { value: 'contactado', label: 'Contactado' },
              { value: 'entrevista', label: 'En proceso de entrevista' },
              { value: 'seleccionado', label: 'Seleccionado' },
              { value: 'rechazado', label: 'Rechazado' }
            ]}
            value={filter}
            onChange={setFilter}
            style={{ width: '220px' }}
          />
        </div>

        {/* Tabla de candidatos */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidades</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-blue-700">{candidate.nombre[0]}{candidate.apellido[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{candidate.nombre} {candidate.apellido}</div>
                          <div className="text-sm text-gray-500">{getSourceName(candidate.fuente)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getPositionName(candidate.puesto)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 mb-1 flex items-center">
                        <IconPhone size={16} className="mr-1 text-gray-400" />
                        {candidate.telefono}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <IconMail size={16} className="mr-1 text-gray-400" />
                        {candidate.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(candidate.estado)}`}>
                          {getStatusName(candidate.estado)}
                        </span>
                        <div className="text-xs text-gray-500 flex items-center">
                          <IconCalendar size={14} className="mr-1" />
                          {formatDate(candidate.fechaContacto)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills && candidate.skills.map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                            {getSkillNameFromValue(skill)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCandidate(candidate)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <IconEdit size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(candidate.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <IconTrash size={18} />
                        </button>
                        
                        {/* Menú rápido de cambio de estado */}
                        <div className="relative group">
                          <button className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 text-xs flex items-center gap-1">
                            Estado <IconFilter size={12} />
                          </button>
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                            <div className="py-1">
                              {candidate.estado !== 'pendiente' && (
                                <button
                                  onClick={() => handleUpdateStatus(candidate.id, 'pendiente')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Pendiente
                                </button>
                              )}
                              {candidate.estado !== 'contactado' && (
                                <button
                                  onClick={() => handleUpdateStatus(candidate.id, 'contactado')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Contactado
                                </button>
                              )}
                              {candidate.estado !== 'entrevista' && (
                                <button
                                  onClick={() => handleUpdateStatus(candidate.id, 'entrevista')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  En Entrevista
                                </button>
                              )}
                              {candidate.estado !== 'seleccionado' && (
                                <button
                                  onClick={() => handleUpdateStatus(candidate.id, 'seleccionado')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Seleccionado
                                </button>
                              )}
                              {candidate.estado !== 'rechazado' && (
                                <button
                                  onClick={() => handleUpdateStatus(candidate.id, 'rechazado')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Rechazado
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No se encontraron candidatos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de formulario */}
        <CandidateFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setCurrentCandidate(null);
          }}
          initialData={currentCandidate}
          onSave={handleSaveCandidate}
        />

        {/* Modal de confirmación de eliminación */}
        <Modal
          opened={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          title="Confirmar eliminación"
        >
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="mr-4 bg-red-100 p-2 rounded-full">
                <IconTrash size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">¿Eliminar este candidato?</h3>
                <p className="text-gray-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteId(null)}
                leftIcon={<IconX size={16} />}
              >
                Cancelar
              </Button>
              <Button 
                color="red" 
                onClick={() => handleDeleteCandidate(confirmDeleteId)}
                leftIcon={<IconTrash size={16} />}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
}