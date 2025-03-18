import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const PipelinePage = () => {
    const [columns, setColumns] = useState({
        'nuevos': {
            id: 'nuevos',
            title: 'Nuevos Prospectos',
            items: [
                {
                    id: 'task-1',
                    name: 'Juan Pérez',
                    phone: '11-5555-1234',
                    products: ['Juego de Ollas 5 piezas'],
                    value: '$280,000',
                    priority: 'ALTA',
                    lastContact: '2024-10-30',
                    notes: 'Interesado en sistema de cocina completo'
                },
                {
                    id: 'task-2',
                    name: 'María López',
                    phone: '11-5555-5678',
                    products: ['Sartén 28cm', 'Olla de Presión'],
                    value: '$150,000',
                    priority: 'MEDIA',
                    lastContact: '2024-10-29',
                    notes: 'Pidió información sobre financiación'
                }
            ]
        },
        'contactados': {
            id: 'contactados',
            title: 'Demostración Agendada',
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
                    demoDate: '2024-11-02'
                }
            ]
        },
        'demo-realizada': {
            id: 'demo-realizada',
            title: 'Demostración Realizada',
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
                    demoDate: '2024-10-27'
                }
            ]
        },
        'negociacion': {
            id: 'negociacion',
            title: 'En Negociación',
            items: [
                {
                    id: 'task-5',
                    name: 'Luis Martinez',
                    phone: '11-5555-7890',
                    products: ['Sistema de Filtración de Agua', 'Juego de Ollas 7 piezas'],
                    value: '$320,000',
                    priority: 'ALTA',
                    lastContact: '2024-10-26',
                    notes: 'Negociando precio final y cuotas',
                    paymentPlan: '12 cuotas'
                }
            ]
        },
        'vendido': {
            id: 'vendido',
            title: 'Venta Cerrada',
            items: [
                {
                    id: 'task-6',
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
                    deliveryDate: '2024-11-05'
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

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Pipeline de Ventas</h1>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {Object.values(columns).map((column) => (
                        <div key={column.id} className="w-80 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow p-4">
                                <h2 className="font-semibold mb-4 flex justify-between">
                                    {column.title}
                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                                        {column.items.length}
                                    </span>
                                </h2>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`min-h-[200px] rounded-lg p-2 ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                                                }`}
                                        >
                                            {column.items.map((item, index) => (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`mb-3 p-4 bg-white rounded-lg border ${snapshot.isDragging ? 'shadow-lg border-blue-500' : 'border-gray-200'
                                                                }`}
                                                        >
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                                                                        {item.name.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-gray-900">{item.name}</div>
                                                                        <div className="text-sm text-gray-500">{item.phone}</div>
                                                                    </div>
                                                                </div>
                                                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                                                                    {item.priority}
                                                                </span>
                                                            </div>

                                                            <div className="mb-2">
                                                                <div className="text-sm font-medium text-gray-700">Productos:</div>
                                                                <ul className="text-sm text-gray-600">
                                                                    {item.products.map((product, idx) => (
                                                                        <li key={idx} className="ml-4 list-disc">{product}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div className="mb-2 text-sm text-gray-600">
                                                                <div>Último contacto: {formatDate(item.lastContact)}</div>
                                                                {item.demoDate && (
                                                                    <div>Demostración: {formatDate(item.demoDate)}</div>
                                                                )}
                                                                {item.deliveryDate && (
                                                                    <div>Entrega: {formatDate(item.deliveryDate)}</div>
                                                                )}
                                                            </div>

                                                            {item.notes && (
                                                                <div className="mb-2 text-sm text-gray-600">
                                                                    <div className="font-medium text-gray-700">Notas:</div>
                                                                    <div>{item.notes}</div>
                                                                </div>
                                                            )}

                                                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                                                                {item.paymentPlan && (
                                                                    <span className="text-sm text-gray-600">
                                                                        {item.paymentPlan}
                                                                    </span>
                                                                )}
                                                                <span className="text-lg font-bold text-green-600">
                                                                    {item.value}
                                                                </span>
                                                            </div>
                                                        </div>
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
        </div>
    );
};

export default PipelinePage;