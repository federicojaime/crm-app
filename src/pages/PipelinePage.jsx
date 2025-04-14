import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tooltip, Modal, Button } from '@mantine/core';
import { Plus, Edit, Trash, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PipelineItemModal from '../components/modals/PipelineItemModal';

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
                        <h3 className="text-lg font-medium text-gray-900">¿Está seguro que desea eliminar este contacto?</h3>
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
                        <div className="text-xs text-gray-500">{item.phone}</div>
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

                            {/* Productos */}
                            <div className="mb-2">
                                <div className="text-sm font-medium text-gray-700">Productos:</div>
                                <ul className="text-sm text-gray-600">
                                    {item.products.map((product, idx) => (
                                        <li key={idx} className="ml-4 list-disc">{product}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Fechas */}
                            <div className="mb-2 text-sm text-gray-600">
                                <div>Último contacto: {formatDate(item.lastContact)}</div>
                                {item.demoDate && (
                                    <div>Demostración: {formatDate(item.demoDate)}</div>
                                )}
                                {item.deliveryDate && (
                                    <div>Entrega: {formatDate(item.deliveryDate)}</div>
                                )}
                            </div>

                            {/* Notas */}
                            {item.notes && (
                                <div className="mb-2 text-sm text-gray-600">
                                    <div className="font-medium text-gray-700">Notas:</div>
                                    <div>{item.notes}</div>
                                </div>
                            )}

                            {/* Valor y botones */}
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
                                    {item.paymentPlan && (
                                        <span className="text-sm text-gray-600 mr-3">
                                            {item.paymentPlan}
                                        </span>
                                    )}
                                    <span className="text-md font-bold text-green-600">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PipelinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, columnId: null, name: '' });

    // Definición de estados de pipeline
    const pipelineStates = {
        'nuevo': {
            id: 'nuevo',
            title: 'Nuevo',
            description: 'Dato nuevo prospecto cargado en el sistema. Es nuevo en el CRM aunque tenga tiempo como cliente.'
        },
        'contactado': {
            id: 'contactado',
            title: 'Contactado / Seguimiento',
            description: 'Se inició un contacto a través de algún canal de comunicación como puede ser llamado o wsp.'
        },
        'cita-agendada': {
            id: 'cita-agendada',
            title: 'Cita Agendada',
            description: 'Se acordó un día y hora para realizar acción comercial que puede ser demo o servicio post venta.'
        },
        'sin-respuesta': {
            id: 'sin-respuesta',
            title: 'No Contesta / Sin Respuesta',
            description: 'El prospecto no acusa recibo, no responde mensajes ni atiende el teléfono.'
        },
        'reprogramar': {
            id: 'reprogramar',
            title: 'Reprogramar / Volver a Llamar',
            description: 'Cancelación de una cita agendada o volver a llamar porque no podía hablar en el momento.'
        },
        'no-venta': {
            id: 'no-venta',
            title: '90 / No Venta',
            description: 'Se realizó acción comercial pero no se concretó una venta.'
        },
        'irrelevante': {
            id: 'irrelevante',
            title: 'Irrelevante / No Califica',
            description: 'El prospecto no cumple con los parámetros para ser considerado como potencial cliente.'
        },
        'no-quiere-spv': {
            id: 'no-quiere-spv',
            title: 'No quiere SPV',
            description: 'No quiere recibir servicio post venta.'
        },
        'no-quiere-demo': {
            id: 'no-quiere-demo',
            title: 'No quiere Demo',
            description: 'No quiere recibir una demostración de cocina saludable.'
        },
        'venta-agregado': {
            id: 'venta-agregado',
            title: 'Venta Agregado',
            description: 'Se concretó una venta de un nuevo producto a un cliente existente.'
        },
        'venta-nueva': {
            id: 'venta-nueva',
            title: 'Venta Nueva',
            description: 'Se concretó una venta de un producto a un cliente nuevo.'
        },
    };

    // Tipos de etiquetas
    const tagTypes = {
        'cliente-satisfecho': { label: 'Cliente Satisfecho', color: 'bg-green-100 text-green-800' },
        'cliente-insatisfecho': { label: 'Cliente Insatisfecho / Enojado', color: 'bg-red-100 text-red-800' },
        'cliente-huerfano': { label: 'Cliente Huérfano', color: 'bg-orange-100 text-orange-800' },
        'casi-cliente': { label: 'Casi Cliente', color: 'bg-yellow-100 text-yellow-800' },
        'no-es-cliente': { label: 'No es cliente', color: 'bg-gray-100 text-gray-800' },
        '4-en-14': { label: '4 en 14', color: 'bg-purple-100 text-purple-800' },
        'referido-activado': { label: 'Referido Activado', color: 'bg-blue-100 text-blue-800' },
        'referido-no-activado': { label: 'Referido No Activado', color: 'bg-indigo-100 text-indigo-800' },
        'urna': { label: 'Urna', color: 'bg-pink-100 text-pink-800' },
        'stand': { label: 'Stand', color: 'bg-teal-100 text-teal-800' },
        'provincia': { label: 'Provincia', color: 'bg-lime-100 text-lime-800' },
        'b2c': { label: 'B2C', color: 'bg-sky-100 text-sky-800' },
        'b2b': { label: 'B2B', color: 'bg-violet-100 text-violet-800' },
    };

    const [columns, setColumns] = useState({
        'nuevo': {
            id: 'nuevo',
            title: 'Nuevo',
            items: [
                {
                    id: 'task-1',
                    name: 'Juan Pérez',
                    phone: '11-5555-1234',
                    products: ['Juego de Ollas 5 piezas'],
                    value: '$280,000',
                    priority: 'ALTA',
                    lastContact: '2024-10-30',
                    notes: 'Interesado en sistema de cocina completo',
                    tags: ['no-es-cliente', 'b2c']
                },
                {
                    id: 'task-2',
                    name: 'María López',
                    phone: '11-5555-5678',
                    products: ['Sartén 28cm', 'Olla de Presión'],
                    value: '$150,000',
                    priority: 'MEDIA',
                    lastContact: '2024-10-29',
                    notes: 'Pidió información sobre financiación',
                    tags: ['no-es-cliente', 'stand']
                }
            ]
        },
        'contactado': {
            id: 'contactado',
            title: 'Contactado / Seguimiento',
            items: [
                {
                    id: 'task-3',
                    name: 'Carlos García',
                    phone: '11-5555-9012',
                    products: ['Sistema de Cocina Completo'],
                    value: '$450,000',
                    priority: 'ALTA',
                    lastContact: '2024-10-28',
                    notes: 'Demostración programada para el 02/11',
                    demoDate: '2024-11-02',
                    tags: ['no-es-cliente', 'referido-activado']
                }
            ]
        },
        'cita-agendada': {
            id: 'cita-agendada',
            title: 'Cita Agendada',
            items: [
                {
                    id: 'task-4',
                    name: 'Ana Fernández',
                    phone: '11-5555-3456',
                    products: ['Juego de Cubiertos', 'Vasos 12 piezas'],
                    value: '$180,000',
                    priority: 'MEDIA',
                    lastContact: '2024-10-27',
                    notes: 'Muy interesada, evaluando opciones de pago',
                    demoDate: '2024-10-27',
                    tags: ['4-en-14', 'provincia']
                }
            ]
        },
        'sin-respuesta': {
            id: 'sin-respuesta',
            title: 'No Contesta / Sin Respuesta',
            items: [
                {
                    id: 'task-5',
                    name: 'Luis Martinez',
                    phone: '11-5555-7890',
                    products: ['Sistema de Filtración de Agua', 'Juego de Ollas 7 piezas'],
                    value: '$320,000',
                    priority: 'BAJA',
                    lastContact: '2024-10-26',
                    notes: 'Ha sido contactado 3 veces sin respuesta',
                    tags: ['urna', 'no-quiere-demo']
                }
            ]
        },
        'no-venta': {
            id: 'no-venta',
            title: '90 / No Venta',
            items: [
                {
                    id: 'task-6',
                    name: 'Roberto González',
                    phone: '11-5555-2345',
                    products: ['Sistema de Cocina Completo'],
                    value: '$0',
                    priority: 'MEDIA',
                    lastContact: '2024-10-26',
                    notes: 'Interesado pero considera alto el precio',
                    tags: ['casi-cliente']
                }
            ]
        },
        'venta-nueva': {
            id: 'venta-nueva',
            title: 'Venta Nueva',
            items: [
                {
                    id: 'task-7',
                    name: 'Laura Gómez',
                    phone: '11-5555-2345',
                    products: [
                        'Sistema de Cocina Completo',
                        'Sistema de Filtración de Agua',
                        'Vajilla 12 piezas'
                    ],
                    value: '$580,000',
                    priority: 'ALTA',
                    lastContact: '2024-10-25',
                    notes: 'Venta cerrada, entrega programada',
                    paymentPlan: '18 cuotas',
                    deliveryDate: '2024-11-05',
                    tags: ['cliente-satisfecho', 'b2c']
                }
            ]
        },
        'venta-caida': {
            id: 'venta-caida',
            title: 'Venta Caida',
            items: [
                {
                    id: 'task-70',
                    name: 'Laura Gómez',
                    phone: '11-5555-2345',
                    products: [
                        'Sistema de Cocina Completo',
                        'Sistema de Filtración de Agua',
                        'Vajilla 12 piezas'
                    ],
                    value: '$580,000',
                    priority: 'ALTA',
                    lastContact: '2024-10-25',
                    notes: 'Venta cerrada, entrega programada',
                    paymentPlan: '18 cuotas',
                    deliveryDate: '2024-11-05',
                    tags: ['cliente-satisfecho', 'b2c']
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
                    id: `task-${Date.now()}`
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
                <h1 className="text-2xl font-bold">Pipeline de Ventas</h1>
                <button
                    onClick={handleCreateItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nuevo Contacto
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
            <PipelineItemModal
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

export default PipelinePage;
