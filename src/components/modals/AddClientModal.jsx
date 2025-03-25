import { useState } from 'react';
import { 
  TextInput,
  Select,
  MultiSelect,
  Textarea,
  Button,
  Stack,
  Group,
  Box,
  Divider,
  ActionIcon
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, Trash, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sourceOptions = [
  { value: 'landing', label: 'Landing Page / Sitio Web' },
  { value: 'referido', label: 'Referido' },
  { value: 'derivado', label: 'Derivado por vendedor' },
  { value: 'stand', label: 'Stand' },
  { value: 'convenio', label: 'Convenio' },
  { value: 'urna', label: 'Urna' },
  { value: 'embajador', label: 'Embajador' },
  { value: 'anuncio', label: 'Anuncio' },
  { value: 'otro', label: 'Otro' }
];

export const AddClientModal = ({ opened, onClose, availableUsers, availableStates, availableTags }) => {
  const [notes, setNotes] = useState(['']);

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      assignedTo: '',
      phone1: '',
      phone2: '',
      email1: '',
      email2: '',
      occupation: '',
      partnerName: '',
      partnerOccupation: '',
      source: '',
      state: '',
      tags: [],
      notes: [''],
      tasks: '',
      sales: ''
    },
    validate: {
      firstName: (value) => value.trim().length === 0 ? 'El nombre es requerido' : null,
      lastName: (value) => value.trim().length === 0 ? 'El apellido es requerido' : null,
      phone1: (value) => value.trim().length === 0 ? 'El teléfono es requerido' : null,
      email1: (value) => !/^\S+@\S+$/.test(value) ? 'Email inválido' : null,
      state: (value) => value.trim().length === 0 ? 'El estado es requerido' : null,
      source: (value) => value.trim().length === 0 ? 'El origen es requerido' : null,
    }
  });

  const handleAddNote = () => {
    const updatedNotes = [...form.values.notes, ''];
    form.setFieldValue('notes', updatedNotes);
    setNotes(updatedNotes);
  };

  const handleRemoveNote = (index) => {
    const updatedNotes = form.values.notes.filter((_, i) => i !== index);
    form.setFieldValue('notes', updatedNotes);
    setNotes(updatedNotes);
  };

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      createdAt: new Date().toISOString(),
    };
    console.log(formData);
    onClose();
    form.reset();
    setNotes(['']);
  };

  return (
    <AnimatePresence>
      {opened && (
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
              <h2 className="text-xl font-semibold text-gray-800">Crear Nuevo Contacto</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
                  <Stack spacing="lg">
                    <Group grow>
                      <TextInput
                        label="Nombre"
                        placeholder="Ingrese el nombre"
                        required
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('firstName')}
                      />
                      <TextInput
                        label="Apellido"
                        placeholder="Ingrese el apellido"
                        required
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('lastName')}
                      />
                    </Group>

                    <Select
                      label="Asignado a"
                      placeholder="Seleccione un usuario"
                      data={availableUsers}
                      classNames={{
                        input: 'border-gray-200 focus:border-blue-500',
                        label: 'text-gray-700 font-medium',
                        dropdown: 'border border-gray-200',
                        item: 'hover:bg-gray-50'
                      }}
                      {...form.getInputProps('assignedTo')}
                    />

                    <Group grow>
                      <TextInput
                        label="Teléfono 1"
                        placeholder="Ingrese el teléfono principal"
                        required
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('phone1')}
                      />
                      <TextInput
                        label="Teléfono 2"
                        placeholder="Ingrese teléfono alternativo"
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('phone2')}
                      />
                    </Group>

                    <Group grow>
                      <TextInput
                        label="Email 1"
                        placeholder="Ingrese el email principal"
                        required
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('email1')}
                      />
                      <TextInput
                        label="Email 2"
                        placeholder="Ingrese email alternativo"
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('email2')}
                      />
                    </Group>

                    <TextInput
                      label="Ocupación"
                      placeholder="Ingrese la ocupación"
                      classNames={{
                        input: 'border-gray-200 focus:border-blue-500',
                        label: 'text-gray-700 font-medium'
                      }}
                      {...form.getInputProps('occupation')}
                    />

                    <Divider 
                      label="Información de Pareja" 
                      labelPosition="center"
                      classNames={{
                        label: 'text-gray-600 px-2',
                        horizontal: 'border-gray-200'
                      }}
                    />

                    <Group grow>
                      <TextInput
                        label="Nombre de la Pareja"
                        placeholder="Ingrese el nombre"
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('partnerName')}
                      />
                      <TextInput
                        label="Ocupación de la Pareja"
                        placeholder="Ingrese la ocupación"
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium'
                        }}
                        {...form.getInputProps('partnerOccupation')}
                      />
                    </Group>

                    <Group grow>
                      <Select
                        label="Origen"
                        placeholder="Seleccione el origen"
                        data={sourceOptions}
                        required
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium',
                          dropdown: 'border border-gray-200',
                          item: 'hover:bg-gray-50'
                        }}
                        {...form.getInputProps('source')}
                      />
                      <Select
                        label="Estado"
                        placeholder="Seleccione el estado"
                        data={availableStates}
                        required
                        classNames={{
                          input: 'border-gray-200 focus:border-blue-500',
                          label: 'text-gray-700 font-medium',
                          dropdown: 'border border-gray-200',
                          item: 'hover:bg-gray-50'
                        }}
                        {...form.getInputProps('state')}
                      />
                    </Group>

                    <MultiSelect
                      label="Etiquetas"
                      placeholder="Seleccione las etiquetas"
                      data={availableTags}
                      searchable
                      classNames={{
                        input: 'border-gray-200 focus:border-blue-500',
                        label: 'text-gray-700 font-medium',
                        dropdown: 'border border-gray-200',
                        item: 'hover:bg-gray-50',
                        value: 'bg-blue-50 border-blue-100'
                      }}
                      {...form.getInputProps('tags')}
                    />

                    <Box className="bg-gray-50 p-4 rounded-lg">
                      <Group position="apart" mb="xs">
                        <Box component="label" className="text-gray-700 font-medium">
                          Notas
                        </Box>
                        <Button 
                          size="xs"
                          leftIcon={<Plus size={14} />}
                          onClick={handleAddNote}
                          variant="outline"
                          className="bg-white hover:bg-gray-50"
                        >
                          Agregar Nota
                        </Button>
                      </Group>
                      <Stack spacing="xs">
                        {form.values.notes.map((note, index) => (
                          <Group key={index} spacing="xs">
                            <Textarea
                              placeholder={`Nota ${index + 1}`}
                              className="flex-1"
                              classNames={{
                                input: 'border-gray-200 focus:border-blue-500 bg-white'
                              }}
                              {...form.getInputProps(`notes.${index}`)}
                            />
                            {form.values.notes.length > 1 && (
                              <ActionIcon
                                color="red"
                                variant="subtle"
                                onClick={() => handleRemoveNote(index)}
                                className="hover:bg-red-50"
                              >
                                <Trash size={16} />
                              </ActionIcon>
                            )}
                          </Group>
                        ))}
                      </Stack>
                    </Box>

                    <Textarea
                      label="Tareas"
                      placeholder="Ingrese las tareas pendientes"
                      minRows={3}
                      classNames={{
                        input: 'border-gray-200 focus:border-blue-500',
                        label: 'text-gray-700 font-medium'
                      }}
                      {...form.getInputProps('tasks')}
                    />

                    <Textarea
                      label="Ventas"
                      placeholder="Información de ventas"
                      minRows={3}
                      classNames={{
                        input: 'border-gray-200 focus:border-blue-500',
                        label: 'text-gray-700 font-medium'
                      }}
                      {...form.getInputProps('sales')}
                    />
                  </Stack>
                </form>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <Group position="right" spacing="sm">
                <Button 
                  variant="default" 
                  onClick={onClose}
                  className="hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={form.onSubmit(handleSubmit)}
                  className="bg-[#508ecb] hover:bg-[#3e78a5] text-white"
                >
                  Guardar
                </Button>
              </Group>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddClientModal;