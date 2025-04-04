// src/components/modals/PipelineItemModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Check, Save, User, Tag, PhoneCall, DollarSign, FileText } from 'lucide-react';
import { DatePicker } from '@mantine/dates';

const PipelineItemModal = ({ isOpen, onClose, initialValues = null, pipelineStates, tagTypes, onSubmit }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    products: [''],
    value: '',
    priority: 'MEDIA',
    lastContact: new Date().toISOString().split('T')[0],
    notes: '',
    tags: [],
    status: 'nuevo',
    demoDate: '',
    deliveryDate: '',
    paymentPlan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar datos del formulario cuando se edita un elemento existente
  useEffect(() => {
    if (initialValues) {
      console.log("Inicializando formulario con:", initialValues);
      
      // Buscamos el columnId (status) para el elemento
      let itemStatus = 'nuevo'; // valor por defecto
      
      // Debemos obtener este valor del parámetro initialValues
      // Si se pasa el status directamente, lo usamos
      if (initialValues.status) {
        itemStatus = initialValues.status;
      } 
      
      setFormData({
        ...initialValues,
        // Asegurarse de que todas las propiedades existan
        products: initialValues.products || [''],
        tags: initialValues.tags || [],
        demoDate: initialValues.demoDate || '',
        deliveryDate: initialValues.deliveryDate || '',
        paymentPlan: initialValues.paymentPlan || '',
        status: itemStatus
      });
    } else {
      // Resetear el formulario para un nuevo elemento
      setFormData({
        id: `task-${Date.now()}`,
        name: '',
        phone: '',
        products: [''],
        value: '',
        priority: 'MEDIA',
        lastContact: new Date().toISOString().split('T')[0],
        notes: '',
        tags: [],
        status: 'nuevo',
        demoDate: '',
        deliveryDate: '',
        paymentPlan: ''
      });
    }
  }, [initialValues, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = value;
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const addProduct = () => {
    setFormData(prev => ({ ...prev, products: [...prev.products, ''] }));
  };

  const removeProduct = (index) => {
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    setFormData(prev => ({ ...prev, products: updatedProducts.length ? updatedProducts : [''] }));
  };

  const toggleTag = (tagId) => {
    setFormData(prev => {
      const tags = [...prev.tags];
      if (tags.includes(tagId)) {
        return { ...prev, tags: tags.filter(t => t !== tagId) };
      } else {
        return { ...prev, tags: [...tags, tagId] };
      }
    });
  };

  const handleDateChange = (name, date) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date.toISOString().split('T')[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sanitizar productos (eliminar strings vacíos)
      const sanitizedProducts = formData.products.filter(p => p.trim() !== '');
      
      // Preparar datos para enviar
      const itemData = {
        ...formData,
        products: sanitizedProducts.length ? sanitizedProducts : ['Sin especificar'],
      };

      // Asegurarnos de preservar el ID original en edición
      if (initialValues?.id) {
        itemData.id = initialValues.id;
      }

      console.log("Enviando datos al guardar:", itemData);
      
      // Enviar al componente padre
      onSubmit(itemData);
      onClose();
    } catch (error) {
      console.error("Error al guardar elemento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 overflow-hidden flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {initialValues ? 'Editar Contacto' : 'Nuevo Contacto'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <User size={16} className="mr-2 text-blue-600" />
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre y apellido"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <PhoneCall size={16} className="mr-2 text-blue-600" />
                        Teléfono
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número de teléfono"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Estado
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Object.entries(pipelineStates).map(([id, state]) => (
                          <option key={id} value={id}>
                            {state.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Prioridad
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ALTA">Alta</option>
                        <option value="MEDIA">Media</option>
                        <option value="BAJA">Baja</option>
                      </select>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <Calendar size={16} className="mr-2 text-blue-600" />
                        Último contacto
                      </label>
                      <DatePicker 
                        value={formData.lastContact ? new Date(formData.lastContact) : null}
                        onChange={(date) => handleDateChange('lastContact', date)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <Calendar size={16} className="mr-2 text-blue-600" />
                        Fecha de demostración
                      </label>
                      <DatePicker 
                        value={formData.demoDate ? new Date(formData.demoDate) : null}
                        onChange={(date) => handleDateChange('demoDate', date)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Productos */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Productos
                    </label>
                    {formData.products.map((product, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={product}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nombre del producto"
                        />
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addProduct}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      + Añadir producto
                    </button>
                  </div>

                  {/* Valor y Plan de pago */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <DollarSign size={16} className="mr-2 text-blue-600" />
                        Valor
                      </label>
                      <input
                        type="text"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="$0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Plan de pago
                      </label>
                      <input
                        type="text"
                        name="paymentPlan"
                        value={formData.paymentPlan}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: 12 cuotas"
                      />
                    </div>
                  </div>

                  {/* Fecha de entrega */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      Fecha de entrega
                    </label>
                    <DatePicker 
                      value={formData.deliveryDate ? new Date(formData.deliveryDate) : null}
                      onChange={(date) => handleDateChange('deliveryDate', date)}
                      className="w-full"
                    />
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <FileText size={16} className="mr-2 text-blue-600" />
                      Notas
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Añadir notas o comentarios"
                      rows={3}
                    />
                  </div>

                  {/* Etiquetas */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                      <Tag size={16} className="mr-2 text-blue-600" />
                      Etiquetas
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(tagTypes).map(([id, tag]) => (
                        <div 
                          key={id}
                          className={`
                            px-3 py-2 rounded-lg text-sm cursor-pointer transition-all
                            ${formData.tags && formData.tags.includes(id) 
                              ? `${tag.color} border-2 border-blue-500` 
                              : 'border border-gray-200 hover:border-blue-200'}
                          `}
                          onClick={() => toggleTag(id)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{tag.label}</span>
                            {formData.tags && formData.tags.includes(id) && (
                              <Check size={16} className="text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PipelineItemModal;