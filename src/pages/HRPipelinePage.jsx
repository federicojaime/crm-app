import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tooltip, Modal, Button } from '@mantine/core';
import { Plus, Edit, Trash, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HRPipelineItemModal from '../components/modals/HRPipelineItemModal';

// Modal de confirmación para borrar
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Confirmar eliminación"
            centered
            size="md"
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">¿Está seguro que desea eliminar este candidato?</h3>
                        <p className="text-gray-600">Esta acción no se puede deshacer.</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="font-medium">{itemName}</p>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="red"
                        onClick={onConfirm}
                    >
                        Eliminar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// Componente de tarjeta colapsable
const CollapsibleCard = ({ item, columnId, index, provided, snapshot, onEdit, onDelete, getPriorityColor, tagTypes, formatDate }) => {
    const [expanded, setExpanded] = useState(false);

    // Calcular iniciales del nombre
    const initials = item.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 bg-white rounded-lg border transition-all ${snapshot.isDragging ? 'shadow-lg border-blue-500' : 'border-gray-200'}`}
        >
            {/* Cabecera siempre visible */}
            <div
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-medium">
                        {initials}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.email}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                    </span>
                    {expanded ?
                        <ChevronUp size={16} className="text-gray-500" /> :
                        <ChevronDown size={16} className="text-gray-500" />
                    }
                </div>
            </div>

            {/* Contenido expandible */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 border-t border-gray-100 pt-2">
                            {/* Etiquetas */}
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {item.tags.map(tag => (
                                        <Tooltip
                                            key={tag}
                                            label={tagTypes[tag]?.label || tag}
                                            withArrow
                                            position="top"
                                        >
                                            <span className={`text-xs px-2 py-1 rounded-full ${tagTypes[tag]?.color || 'bg-gray-100 text-gray-700'} cursor-help`}>
                                                {tagTypes[tag]?.label || tag}
                                            </span>
                                        </Tooltip>
                                    ))}
                                </div>
                            )}

                            {/* Puesto y departamento */}
                            <div className="mb-2">
                                <div className="text-sm font-medium text-gray-700">Puesto:</div>
                                <div className="text-sm text-gray-600">{item.position}</div>
                            </div>

                            <div className="mb-2">
                                <div className="text-sm font-medium text-gray-700">Departamento:</div>
                                <div className="text-sm text-gray-600">{item.department}</div>
                            </div>

                            {/* Habilidades */}
                            <div className="mb-2">
                                <div className="text-sm font-medium text-gray-700">Habilidades:</div>
                                <ul className="text-sm text-gray-600">
                                    {item.skills.map((skill, idx) => (
                                        <li key={idx} className="ml-4 list-disc">{skill}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Fechas */}
                            <div className="mb-2 text-sm text-gray-600">
                                <div>Fecha de aplicación: {formatDate(item.applicationDate)}</div>
                                {item.interviewDate && (
                                    <div>Entrevista programada: {formatDate(item.interviewDate)}</div>
                                )}
                                {item.hireDate && (
                                    <div>Fecha de contratación: {formatDate(item.hireDate)}</div>
                                )}
                            </div>

                            {/* Notas */}
                            {item.notes && (
                                <div className="mb-2 text-sm text-gray-600">
                                    <div className="font-medium text-gray-700">Notas:</div>
                                    <div>{item.notes}</div>
                                </div>
                            )}

                            {/* Salario y botones */}
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(item);
                                        }}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id, columnId, item.name);
                                        }}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    {item.contractType && (
                                        <span className="text-sm text-gray-600 mr-3">
                                            {item.contractType}
                                        </span>
                                    )}
                                    {item.salary && (
                                        <span className="text-md font-bold text-green-600">
                                            {item.salary}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const HRPipelinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, columnId: null, name: '' });

    // Definición de estados de pipeline
    const pipelineStates = {
        'nuevas-aplicaciones': {
            id: 'nuevas-aplicaciones',
            title: 'Nuevas Aplicaciones',
            description: 'Candidatos que acaban de aplicar para una posición en la empresa.'
        },
        'revision-cv': {
            id: 'revision-cv',
            title: 'Revisión de CV',
            description: 'CVs en proceso de revisión por parte del equipo de RRHH.'
        },
        'preseleccionados': {
            id: 'preseleccionados',
            title: 'Preseleccionados',
            description: 'Candidatos que pasaron la primera revisión y han sido preseleccionados.'
        },
        'entrevista-rrhh': {
            id: 'entrevista-rrhh',
            title: 'Entrevista RRHH',
            description: 'Candidatos programados para entrevista inicial con el equipo de recursos humanos.'
        },
        'entrevista-tecnica': {
            id: 'entrevista-tecnica',
            title: 'Entrevista Técnica',
            description: 'Candidatos programados para entrevista técnica con el departamento solicitante.'
        },
        'prueba-tecnica': {
            id: 'prueba-tecnica',
            title: 'Prueba Técnica',
            description: 'Candidatos realizando pruebas técnicas o ejercicios prácticos.'
        },
        'entrevista-final': {
            id: 'entrevista-final',
            title: 'Entrevista Final',
            description: 'Candidatos en fase de entrevista final con gerencia o directivos.'
        },
        'oferta-enviada': {
            id: 'oferta-enviada',
            title: 'Oferta Enviada',
            description: 'Candidatos a los que se les ha enviado una oferta formal de empleo.'
        },
        'negociacion': {
            id: 'negociacion',
            title: 'Negociación',
            description: 'En proceso de negociación de condiciones con el candidato.'
        },
        'contratado': {
            id: 'contratado',
            title: 'Contratado',
            description: 'Candidatos que aceptaron la oferta y están en proceso de incorporación.'
        },
        'onboarding': {
            id: 'onboarding',
            title: 'Onboarding',
            description: 'Nuevos empleados en proceso de inducción y capacitación inicial.'
        },
        'rechazado': {
            id: 'rechazado',
            title: 'Rechazado',
            description: 'Candidatos que no avanzaron en el proceso de selección.'
        },
    };

    // Tipos de etiquetas
    const tagTypes = {
        'urgente': { label: 'Urgente', color: 'bg-red-100 text-red-800' },
        'senior': { label: 'Senior', color: 'bg-blue-100 text-blue-800' },
        'mid-level': { label: 'Mid-Level', color: 'bg-green-100 text-green-800' },
        'junior': { label: 'Junior', color: 'bg-yellow-100 text-yellow-800' },
        'remoto': { label: 'Remoto', color: 'bg-purple-100 text-purple-800' },
        'presencial': { label: 'Presencial', color: 'bg-indigo-100 text-indigo-800' },
        'hibrido': { label: 'Híbrido', color: 'bg-pink-100 text-pink-800' },
        'recomendado': { label: 'Recomendado', color: 'bg-teal-100 text-teal-800' },
        'recontratacion': { label: 'Recontratación', color: 'bg-orange-100 text-orange-800' },
        'extranjero': { label: 'Extranjero', color: 'bg-lime-100 text-lime-800' },
        'traslado': { label: 'Traslado', color: 'bg-sky-100 text-sky-800' },
        'tiempo-parcial': { label: 'Tiempo Parcial', color: 'bg-violet-100 text-violet-800' },
        'promocion-interna': { label: 'Promoción Interna', color: 'bg-amber-100 text-amber-800' },
    };

    const [columns, setColumns] = useState({
        'nuevas-aplicaciones': {
            id: 'nuevas-aplicaciones',
            title: 'Nuevas Aplicaciones',
            items: [
                {
                    id: 'cand-1',
                    name: 'Alejandro Torres',
                    email: 'alejandro.torres@email.com',
                    position: 'Desarrollador Full Stack',
                    department: 'Tecnología',
                    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
                    salary: '$90,000',
                    priority: 'ALTA',
                    applicationDate: '2024-10-30',
                    notes: 'Buena experiencia en desarrollo frontend y backend',
                    tags: ['senior', 'remoto']
                },
                {
                    id: 'cand-2',
                    name: 'Marcela Rojas',
                    email: 'marcela.rojas@email.com',
                    position: 'Analista de Marketing Digital',
                    department: 'Marketing',
                    skills: ['SEO', 'SEM', 'Google Ads', 'Analítica Web'],
                    salary: '$75,000',
                    priority: 'MEDIA',
                    applicationDate: '2024-10-29',
                    notes: 'Experiencia en campañas de redes sociales',
                    tags: ['mid-level', 'hibrido']
                }
            ]
        },
        'revision-cv': {
            id: 'revision-cv',
            title: 'Revisión de CV',
            items: [
                {
                    id: 'cand-3',
                    name: 'Gabriel Mendoza',
                    email: 'gabriel.mendoza@email.com',
                    position: 'Contador Senior',
                    department: 'Finanzas',
                    skills: ['Contabilidad', 'SAP', 'Impuestos', 'Excel Avanzado'],
                    salary: '$85,000',
                    priority: 'ALTA',
                    applicationDate: '2024-10-28',
                    notes: 'Experiencia en auditoría y planificación fiscal',
                    tags: ['senior', 'presencial']
                }
            ]
        },
        'preseleccionados': {
            id: 'preseleccionados',
            title: 'Preseleccionados',
            items: [
                {
                    id: 'cand-4',
                    name: 'Valeria Gómez',
                    email: 'valeria.gomez@email.com',
                    position: 'Diseñador UX/UI',
                    department: 'Diseño',
                    skills: ['Figma', 'Adobe XD', 'Sketch', 'Investigación de Usuarios'],
                    salary: '$78,000',
                    priority: 'MEDIA',
                    applicationDate: '2024-10-27',
                    notes: 'Portfolio muy completo con proyectos relevantes',
                    tags: ['mid-level', 'remoto']
                }
            ]
        },
        'entrevista-rrhh': {
            id: 'entrevista-rrhh',
            title: 'Entrevista RRHH',
            items: [
                {
                    id: 'cand-5',
                    name: 'Diego Silva',
                    email: 'diego.silva@email.com',
                    position: 'Gerente de Ventas',
                    department: 'Ventas',
                    skills: ['Liderazgo', 'Negociación', 'CRM', 'Desarrollo de Equipos'],
                    salary: '$110,000',
                    priority: 'ALTA',
                    applicationDate: '2024-10-26',
                    interviewDate: '2024-11-02',
                    notes: 'Experiencia en mercado internacional',
                    tags: ['senior', 'presencial', 'recomendado']
                }
            ]
        },
        'entrevista-tecnica': {
            id: 'entrevista-tecnica',
            title: 'Entrevista Técnica',
            items: [
                {
                    id: 'cand-6',
                    name: 'Lucía Martínez',
                    email: 'lucia.martinez@email.com',
                    position: 'Analista de Datos',
                    department: 'Business Intelligence',
                    skills: ['Python', 'SQL', 'Power BI', 'Machine Learning'],
                    salary: '$92,000',
                    priority: 'ALTA',
                    applicationDate: '2024-10-25',
                    interviewDate: '2024-11-03',
                    notes: 'Experiencia relevante en análisis predictivo',
                    tags: ['senior', 'hibrido']
                }
            ]
        },
        'prueba-tecnica': {
            id: 'prueba-tecnica',
            title: 'Prueba Técnica',
            items: [
                {
                    id: 'cand-7',
                    name: 'Matías Herrera',
                    email: 'matias.herrera@email.com',
                    position: 'Desarrollador Frontend',
                    department: 'Tecnología',
                    skills: ['JavaScript', 'React', 'CSS', 'Responsive Design'],
                    salary: '$85,000',
                    priority: 'MEDIA',
                    applicationDate: '2024-10-24',
                    interviewDate: '2024-10-31',
                    notes: 'Prueba técnica enviada, pendiente de entrega',
                    tags: ['mid-level', 'remoto']
                }
            ]
        },
        'oferta-enviada': {
            id: 'oferta-enviada',
            title: 'Oferta Enviada',
            items: [
                {
                    id: 'cand-8',
                    name: 'Fernanda López',
                    email: 'fernanda.lopez@email.com',
                    position: 'Especialista en RRHH',
                    department: 'Recursos Humanos',
                    skills: ['Reclutamiento', 'Evaluación', 'Desarrollo Organizacional', 'Legislación Laboral'],
                    salary: '$82,000',
                    contractType: 'Indefinido',
                    priority: 'ALTA',
                    applicationDate: '2024-10-20',
                    interviewDate: '2024-10-27',
                    notes: 'Oferta enviada el 31/10, esperando respuesta',
                    tags: ['senior', 'presencial']
                }
            ]
        },
        'contratado': {
            id: 'contratado',
            title: 'Contratado',
            items: [
                {
                    id: 'cand-9',
                    name: 'Roberto Navarro',
                    email: 'roberto.navarro@email.com',
                    position: 'Ingeniero DevOps',
                    department: 'Infraestructura',
                    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                    salary: '$98,000',
                    contractType: 'Indefinido',
                    priority: 'ALTA',
                    applicationDate: '2024-10-15',
                    interviewDate: '2024-10-22',
                    hireDate: '2024-11-01',
                    notes: 'Incorporación prevista para el 15/11',
                    tags: ['senior', 'hibrido']
                }
            ]
        }
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
        } else {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'ALTA': 'bg-red-100 text-red-800',
            'MEDIA': 'bg-yellow-100 text-yellow-800',
            'BAJA': 'bg-green-100 text-green-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR');
    };

    // Método para crear un nuevo elemento en el pipeline
    const handleCreateItem = () => {
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    // Método para editar un elemento existente
    const handleEditItem = (item) => {
        console.log("Editando elemento:", item);
        // Hacer una copia profunda para evitar problemas de referencia
        setCurrentItem(JSON.parse(JSON.stringify(item)));
        setIsModalOpen(true);
    };

    // Método para abrir el modal de confirmación de eliminación
    const handleDeletePrompt = (itemId, columnId, itemName) => {
        setItemToDelete({ id: itemId, columnId, name: itemName });
        setDeleteModalOpen(true);
    };

    // Método para eliminar un elemento después de la confirmación
    const handleConfirmDelete = () => {
        const { id, columnId } = itemToDelete;

        setColumns(prev => {
            const column = prev[columnId];
            const updatedItems = column.items.filter(item => item.id !== id);

            return {
                ...prev,
                [columnId]: {
                    ...column,
                    items: updatedItems
                }
            };
        });

        setDeleteModalOpen(false);
    };

    // Método para guardar un elemento (nuevo o editado)
    const handleSubmitItem = (itemData) => {
        const { status, ...rest } = itemData;

        // Asegurarse de que el estado sea válido
        if (!columns[status]) {
            console.error(`Estado no válido: ${status}`);
            return;
        }

        console.log("Guardando elemento:", itemData);

        if (currentItem) {
            // Editar - actualizar el elemento existente
            setColumns(prev => {
                const allColumns = JSON.parse(JSON.stringify(prev));
                let found = false;

                // Buscar el elemento en todas las columnas
                Object.keys(allColumns).forEach(colId => {
                    const column = allColumns[colId];
                    const itemIndex = column.items.findIndex(item => item.id === currentItem.id);

                    if (itemIndex >= 0) {
                        found = true;
                        if (colId === status) {
                            allColumns[colId].items[itemIndex] = {
                                ...rest,
                                id: currentItem.id
                            };
                        } else {
                            allColumns[colId].items.splice(itemIndex, 1);
                            allColumns[status].items.push({
                                ...rest,
                                id: currentItem.id
                            });
                        }
                    }
                });

                if (!found) {
                    console.warn("Elemento no encontrado para edición, agregándolo a la columna:", status);
                    allColumns[status].items.push({
                        ...rest,
                        id: currentItem.id
                    });
                }

                return allColumns;
            });
        } else {
            // Crear - añadir a la columna correspondiente
            setColumns(prev => {
                const newItem = {
                    ...rest,
                    id: `cand-${Date.now()}`
                };

                return {
                    ...prev,
                    [status]: {
                        ...prev[status],
                        items: [...prev[status].items, newItem]
                    }
                };
            });
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pipeline de Recursos Humanos</h1>
                <button
                    onClick={handleCreateItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nuevo Candidato
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {Object.values(columns).map((column) => (
                        <div key={column.id} className="w-80 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow p-4">
                                <Tooltip
                                    label={pipelineStates[column.id]?.description || column.title}
                                    withArrow
                                    position="top"
                                >
                                    <h2 className="font-semibold mb-4 flex justify-between cursor-help">
                                        {column.title}
                                        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                                            {column.items.length}
                                        </span>
                                    </h2>
                                </Tooltip>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`h-96 overflow-y-auto rounded-lg p-2 ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'}`}
                                        >
                                            {column.items.map((item, index) => (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <CollapsibleCard
                                                            item={item}
                                                            columnId={column.id}
                                                            index={index}
                                                            provided={provided}
                                                            snapshot={snapshot}
                                                            onEdit={handleEditItem}
                                                            onDelete={handleDeletePrompt}
                                                            getPriorityColor={getPriorityColor}
                                                            tagTypes={tagTypes}
                                                            formatDate={formatDate}
                                                        />
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {/* Modal para añadir/editar elementos del pipeline */}
            <HRPipelineItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialValues={currentItem}
                pipelineStates={pipelineStates}
                tagTypes={tagTypes}
                onSubmit={handleSubmitItem}
            />

            {/* Modal de confirmación para eliminar */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete.name}
            />
        </div>
    );
};

export default HRPipelinePage;