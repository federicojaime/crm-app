// src/components/modals/SaleFormModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, DollarSign, User, Tag } from 'lucide-react';
import { DatePicker } from '@mantine/dates';
import {
    TextInput,
    NumberInput,
    Select,
    MultiSelect,
    Checkbox,
    Textarea,
    Group,
    Stack,
    Tabs,
    Divider,
} from '@mantine/core';

// Componente de formulario para registrar órdenes de compra
const SaleFormModal = ({ isOpen, onClose, onSave, sellers, initialData = null }) => {
    const defaultFormData = {
        id: null,
        fecha: new Date(),
        vendedor: '',
        origen: '',
        referido: '',
        esAgregado: false,
        clienteNombre: '',

        // Productos
        productos: {
            juegos: [],
            ollasIndividuales: [],
            ollaPresion: [],
            sartenes: [],
            coladores: [],
            planchas: [],
            extractores: [],
            cuchillos: []
        },

        // Información de pago
        precioLista: 0,
        modalidadPago: 'efectivo',
        cuotas: '',
        valorCuota: 0,
        anticipoAcordado: 0,
        deudaAnticipo: 0,
        fechaCobroTotal: new Date(),

        // Otros
        regaloVenta: false,
        detalleRegalo: '',
        observaciones: '',
        requiereFactura: false,
        datosFactura: ''
    };

    const [formData, setFormData] = useState(initialData || defaultFormData);
    const [activeTab, setActiveTab] = useState('cliente');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(initialData || defaultFormData);
    }, [initialData, isOpen]);

    const handleChange = (field, value) => {
        const fields = field.split('.');

        if (fields.length === 1) {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else if (fields.length === 2) {
            // Para campos anidados como 'productos.juegos'
            setFormData(prev => ({
                ...prev,
                [fields[0]]: {
                    ...prev[fields[0]],
                    [fields[1]]: value
                }
            }));
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        try {
            // Generar ID si es nueva venta
            const saleData = {
                ...formData,
                id: formData.id || Date.now(),
            };
            onSave(saleData);
            onClose();
        } catch (error) {
            console.error('Error al guardar la orden:', error);
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
                                Orden de Compra
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
                                <Tabs value={activeTab} onChange={setActiveTab} className="mb-6">
                                    <Tabs.List>
                                        <Tabs.Tab value="cliente">
                                            Datos del Cliente
                                        </Tabs.Tab>
                                        <Tabs.Tab value="productos">
                                            Productos
                                        </Tabs.Tab>
                                        <Tabs.Tab value="pago">
                                            Pago
                                        </Tabs.Tab>
                                        <Tabs.Tab value="otros">
                                            Otros Datos
                                        </Tabs.Tab>
                                    </Tabs.List>
                                </Tabs>

                                {/* Pestaña de Datos del Cliente */}
                                {activeTab === 'cliente' && (
                                    <Stack spacing="md">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <Calendar size={16} className="mr-2 text-blue-600" />
                                                Fecha de la Venta
                                            </label>
                                            <DatePicker
                                                placeholder="Seleccionar fecha"
                                                required
                                                value={formData.fecha instanceof Date ? formData.fecha : new Date(formData.fecha)}
                                                onChange={(value) => handleChange('fecha', value)}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <User size={16} className="mr-2 text-blue-600" />
                                                Vendedor/a
                                            </label>
                                            <Select
                                                placeholder="Seleccionar vendedor"
                                                required
                                                data={sellers}
                                                value={formData.vendedor}
                                                onChange={(value) => handleChange('vendedor', value)}
                                                description="Si figura más de un vendedor en la orden, seleccionar uno y aclarar en observaciones"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                ¿De dónde fue extraído el prospecto?
                                            </label>
                                            <Select
                                                placeholder="Seleccionar origen"
                                                required
                                                data={[
                                                    { value: 'referido', label: 'Referido' },
                                                    { value: 'base', label: 'Base de datos' },
                                                    { value: 'exhibicion', label: 'Exhibición' },
                                                    { value: 'digital', label: 'Marketing Digital' },
                                                    { value: 'stand', label: 'Stand' },
                                                    { value: 'convenio', label: 'Convenio' },
                                                    { value: 'urna', label: 'Urna' },
                                                    { value: 'embajador', label: 'Embajador' },
                                                    { value: 'anuncio', label: 'Anuncio' },
                                                    { value: 'otro', label: 'Otro' }
                                                ]}
                                                value={formData.origen}
                                                onChange={(value) => handleChange('origen', value)}
                                                className="w-full"
                                            />
                                        </div>

                                        {formData.origen === 'referido' && (
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Nombre y apellido de la persona que refirió
                                                </label>
                                                <TextInput
                                                    placeholder="Ingrese el nombre completo"
                                                    value={formData.referido}
                                                    onChange={(e) => handleChange('referido', e.currentTarget.value)}
                                                    description="Completar si el dato extraído es de un programa de regalos"
                                                    className="w-full"
                                                />
                                            </div>
                                        )}

                                        <div className="py-2">
                                            <Checkbox
                                                label="¿Es agregado?"
                                                checked={formData.esAgregado}
                                                onChange={(e) => handleChange('esAgregado', e.currentTarget.checked)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Nombre y Apellido del Cliente
                                            </label>
                                            <TextInput
                                                placeholder="Ingrese nombre y apellido en mayúsculas"
                                                required
                                                value={formData.clienteNombre}
                                                onChange={(e) => handleChange('clienteNombre', e.currentTarget.value.toUpperCase())}
                                                className="w-full"
                                            />
                                        </div>
                                    </Stack>
                                )}

                                {/* Pestaña de Productos */}
                                {activeTab === 'productos' && (
                                    <div>
                                        <Tabs defaultValue="juegos">
                                            <Tabs.List>
                                                <Tabs.Tab value="juegos">Juegos</Tabs.Tab>
                                                <Tabs.Tab value="ollas">Ollas</Tabs.Tab>
                                                <Tabs.Tab value="sartenes">Sartenes</Tabs.Tab>
                                                <Tabs.Tab value="otros">Otros Productos</Tabs.Tab>
                                            </Tabs.List>

                                            <Tabs.Panel value="juegos" pt="md">
                                                <div className="py-4">
                                                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                        <Tag size={16} className="mr-2 text-blue-600" />
                                                        Juegos
                                                    </label>
                                                    <MultiSelect
                                                        placeholder="Seleccionar juegos vendidos"
                                                        data={[
                                                            { value: '15pcs', label: '15 pcs' },
                                                            { value: '10pcs', label: '10 pcs' },
                                                            { value: '8pcs', label: '8 pcs' },
                                                            { value: '7pcs', label: '7 pcs' },
                                                            { value: '5pcs_complementario', label: '5 pcs complementario' },
                                                            { value: '5pcs_esencial', label: '5 pcs esencial' }
                                                        ]}
                                                        value={formData.productos.juegos}
                                                        onChange={(value) => handleChange('productos.juegos', value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </Tabs.Panel>

                                            <Tabs.Panel value="ollas" pt="md">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">
                                                            Ollas Individuales
                                                        </label>
                                                        <MultiSelect
                                                            placeholder="Seleccionar ollas vendidas"
                                                            data={[
                                                                { value: 'olla_30l', label: 'Olla de 30 lts con tapa' },
                                                                { value: 'olla_20l', label: 'Olla de 20 lts con tapa' },
                                                                { value: 'olla_12l', label: 'Olla de 12 lts con tapa' },
                                                                { value: 'olla_8l', label: 'Olla de 8 lts con tapa' },
                                                                { value: 'olla_6l', label: 'Olla de 6 lts con tapa' },
                                                                { value: 'olla_4l', label: 'Olla de 4 lts con tapa' },
                                                                { value: 'olla_3l', label: 'Olla de 3 lts con tapa' },
                                                                { value: 'olla_2l', label: 'Olla de 2 lts con tapa' },
                                                                { value: 'olla_1.5l', label: 'Olla 1.5lt con tapa' },
                                                                { value: 'pavera', label: 'Pavera ovalada' }
                                                            ]}
                                                            value={formData.productos.ollasIndividuales}
                                                            onChange={(value) => handleChange('productos.ollasIndividuales', value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">
                                                            Ollas a Presión
                                                        </label>
                                                        <MultiSelect
                                                            placeholder="Seleccionar ollas a presión vendidas"
                                                            data={[
                                                                { value: 'presion_6l', label: 'Olla a presión 6lts' },
                                                                { value: 'presion_10l', label: 'Olla a presión 10 lts' }
                                                            ]}
                                                            value={formData.productos.ollaPresion}
                                                            onChange={(value) => handleChange('productos.ollaPresion', value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </Tabs.Panel>

                                            <Tabs.Panel value="sartenes" pt="md">
                                                <div className="py-4">
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Sartenes
                                                    </label>
                                                    <MultiSelect
                                                        placeholder="Seleccionar sartenes vendidas"
                                                        data={[
                                                            { value: 'sarten_26', label: 'Sartén 26cm con tapa' },
                                                            { value: 'sarten_20', label: 'Sartén 20cm con tapa' },
                                                            { value: 'paellera_14', label: 'Paellera 14" con tapa' },
                                                            { value: 'paellera_10', label: 'Paellera 10" con tapa' },
                                                            { value: 'juego_gourmet', label: 'Juego de Sartenes Gourmet 4 pza' },
                                                            { value: 'sarten_gourmet_24', label: 'Sartén gourmet 24cm con tapa' },
                                                            { value: 'sarten_gourmet_20', label: 'Sartén gourmet 20cm con tapa' },
                                                            { value: 'easy_8', label: 'Sartén Easy Deluxe 8" (chica)' },
                                                            { value: 'easy_10', label: 'Sartén Easy Deluxe 10" (mediana)' },
                                                            { value: 'easy_12', label: 'Sartén Easy Deluxe 12" (grande)' },
                                                            { value: 'juego_easy', label: 'Juego de Sartenes 3 Easy' }
                                                        ]}
                                                        value={formData.productos.sartenes}
                                                        onChange={(value) => handleChange('productos.sartenes', value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </Tabs.Panel>

                                            <Tabs.Panel value="otros" pt="md">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">
                                                            Coladores
                                                        </label>
                                                        <MultiSelect
                                                            placeholder="Seleccionar coladores vendidos"
                                                            data={[
                                                                { value: 'colador_grande', label: 'Colador Grande 26cm' },
                                                                { value: 'colador_pequeño', label: 'Colador Pequeño 20cm' }
                                                            ]}
                                                            value={formData.productos.coladores}
                                                            onChange={(value) => handleChange('productos.coladores', value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">
                                                            Planchas
                                                        </label>
                                                        <MultiSelect
                                                            placeholder="Seleccionar planchas vendidas"
                                                            data={[
                                                                { value: 'plancha_doble', label: 'Plancha Doble RP' },
                                                                { value: 'plancha_redonda', label: 'Plancha redonda' },
                                                                { value: 'plancha_sencilla', label: 'Plancha sencilla' }
                                                            ]}
                                                            value={formData.productos.planchas}
                                                            onChange={(value) => handleChange('productos.planchas', value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">
                                                            Extractores y otros
                                                        </label>
                                                        <MultiSelect
                                                            placeholder="Seleccionar extractores y otros productos"
                                                            data={[
                                                                { value: 'maxtractor', label: 'Maxtractor' },
                                                                { value: 'hervidor', label: 'Hervidor 900 ML.' },
                                                                { value: 'tazones_4', label: 'Tazones 4' },
                                                                { value: 'tazones_2', label: 'Tazones 2' },
                                                                { value: 'cafetera_10', label: 'Cafetera Expresso 10 tazas' },
                                                                { value: 'cafetera_4', label: 'Cafetera Expresso 4 tazas' },
                                                                { value: 'expertea', label: 'Expertea' },
                                                                { value: 'combo_pequeño', label: 'Combo Pequeño (Paellera + Olla de 2 litros)' },
                                                                { value: 'combo_mediano', label: 'Combo Mediano (Paellera 10" + Olla de 6 s/t)' },
                                                                { value: 'combo_grande', label: 'Combo Grande (Paellera 14" + Olla de 6 c/t + Olla de 3 lt)' }
                                                            ]}
                                                            value={formData.productos.extractores}
                                                            onChange={(value) => handleChange('productos.extractores', value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-700 font-medium mb-2">
                                                            Cuchillos y otros
                                                        </label>
                                                        <MultiSelect
                                                            placeholder="Seleccionar cuchillos y otros"
                                                            data={[
                                                                { value: 'bloque_completo', label: 'RP Bloque completo de cuchillos' },
                                                                { value: 'bloque_acacia', label: 'Bloque de acacia (solo)' },
                                                                { value: 'juego_5', label: 'Juego de 5 piezas cuchillos' },
                                                                { value: 'juego_asador', label: 'Juego del asador (para trinchar)' },
                                                                { value: 'serruchos_4', label: 'Cuchillos serruchos 4 piezas' },
                                                                { value: 'hacha', label: 'Hacha de cocina Precision Serie III' },
                                                                { value: 'santoku', label: 'Santoku 5"' },
                                                                { value: 'cuchillo_asador', label: 'Cuchillo de asador 8"' },
                                                                { value: 'tenedor_asador', label: 'Tenedor de asador' },
                                                                { value: 'tijeras', label: 'Tijeras Precision Series III' },
                                                                { value: 'tabla_grande', label: 'Tabla Bambu Grande' },
                                                                { value: 'tabla_chica', label: 'Tabla Bambu Chica' }
                                                            ]}
                                                            value={formData.productos.cuchillos}
                                                            onChange={(value) => handleChange('productos.cuchillos', value)}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </Tabs.Panel>
                                        </Tabs>

                                        <Divider className="my-4" />

                                        <div className="py-2">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Observaciones sobre productos vendidos
                                            </label>
                                            <Textarea
                                                placeholder="Ej: 'Se vendió un combo personalizado', 'Cliente prefiere color rojo', etc."
                                                minRows={3}
                                                value={formData.observacionesProductos}
                                                onChange={(e) => handleChange('observacionesProductos', e.currentTarget.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Pestaña de Pago */}
                                {activeTab === 'pago' && (
                                    <Stack spacing="md">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <DollarSign size={16} className="mr-2 text-blue-600" />
                                                Precio de lista
                                            </label>
                                            <NumberInput
                                                placeholder="Ingrese el precio de lista"
                                                required
                                                min={0}
                                                value={formData.precioLista}
                                                onChange={(value) => handleChange('precioLista', value)}
                                                description="Número sin coma ni punto"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Modalidad de pago
                                            </label>
                                            <Select
                                                placeholder="Seleccionar modalidad"
                                                required
                                                data={[
                                                    { value: 'contado', label: 'Contado' },
                                                    { value: 'efectivo', label: 'Efectivo' },
                                                    { value: 'tarjeta', label: 'Tarjeta de Crédito' },
                                                    { value: 'transferencia', label: 'Transferencia Bancaria' },
                                                    { value: 'financiado', label: 'Financiado por Hy Cite' }
                                                ]}
                                                value={formData.modalidadPago}
                                                onChange={(value) => handleChange('modalidadPago', value)}
                                                className="w-full"
                                            />
                                        </div>

                                        {formData.modalidadPago === 'financiado' && (
                                            <>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Cantidad de cuotas
                                                    </label>
                                                    <Select
                                                        placeholder="Seleccionar cantidad de cuotas"
                                                        data={[
                                                            { value: '3', label: '3 cuotas' },
                                                            { value: '6', label: '6 cuotas' },
                                                            { value: '12', label: '12 cuotas' },
                                                            { value: '14', label: '14 cuotas' },
                                                            { value: '18', label: '18 cuotas' },
                                                            { value: 'otro', label: 'Otro' }
                                                        ]}
                                                        value={formData.cuotas}
                                                        onChange={(value) => handleChange('cuotas', value)}
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                        <DollarSign size={16} className="mr-2 text-blue-600" />
                                                        Valor de la cuota
                                                    </label>
                                                    <NumberInput
                                                        placeholder="Ingrese el valor de la cuota"
                                                        min={0}
                                                        value={formData.valorCuota}
                                                        onChange={(value) => handleChange('valorCuota', value)}
                                                        description="Número sin coma ni punto (0 si es de contado)"
                                                        className="w-full"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <DollarSign size={16} className="mr-2 text-blue-600" />
                                                Anticipo acordado
                                            </label>
                                            <NumberInput
                                                placeholder="Ingrese el anticipo acordado"
                                                required
                                                min={0}
                                                value={formData.anticipoAcordado}
                                                onChange={(value) => handleChange('anticipoAcordado', value)}
                                                description="Valor TOTAL del anticipo, aunque haya sido entregado de forma parcial"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <DollarSign size={16} className="mr-2 text-blue-600" />
                                                Deuda del anticipo/contado
                                            </label>
                                            <NumberInput
                                                placeholder="Ingrese la deuda pendiente"
                                                required
                                                min={0}
                                                value={formData.deudaAnticipo}
                                                onChange={(value) => handleChange('deudaAnticipo', value)}
                                                description="Colocar 0 si el cliente entregó el 100% del anticipo"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                                <Calendar size={16} className="mr-2 text-blue-600" />
                                                Fecha de cobro del anticipo total o el pago de la 2° entrega de contado
                                            </label>
                                            <DatePicker
                                                placeholder="Seleccionar fecha"
                                                required
                                                value={formData.fechaCobroTotal instanceof Date ? formData.fechaCobroTotal : new Date(formData.fechaCobroTotal)}
                                                onChange={(value) => handleChange('fechaCobroTotal', value)}
                                                description="Si está 100% saldado, colocar la fecha de venta. Si es contraentrega, aprox. 15 días después"
                                                className="w-full"
                                            />
                                        </div>
                                    </Stack>
                                )}

                                {/* Pestaña de Otros Datos */}
                                {activeTab === 'otros' && (
                                    <Stack spacing="md">
                                        <div className="py-2">
                                            <Checkbox
                                                label="¿Hubo regalo de cierre?"
                                                checked={formData.regaloVenta}
                                                onChange={(e) => handleChange('regaloVenta', e.currentTarget.checked)}
                                            />
                                        </div>

                                        {formData.regaloVenta && (
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Detalle del regalo
                                                </label>
                                                <TextInput
                                                    placeholder="Describa el regalo ofrecido"
                                                    value={formData.detalleRegalo}
                                                    onChange={(e) => handleChange('detalleRegalo', e.currentTarget.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Observaciones
                                            </label>
                                            <Textarea
                                                placeholder="Ej: 'Cliente requiere factura', 'Pago con cheques', etc."
                                                minRows={4}
                                                value={formData.observaciones}
                                                onChange={(e) => handleChange('observaciones', e.currentTarget.value)}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="py-2">
                                            <Checkbox
                                                label="¿Requiere factura?"
                                                checked={formData.requiereFactura}
                                                onChange={(e) => handleChange('requiereFactura', e.currentTarget.checked)}
                                            />
                                        </div>

                                        {formData.requiereFactura && (
                                            <div>
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Datos para facturación
                                                </label>
                                                <TextInput
                                                    placeholder="CUIT, razón social y tipo de factura"
                                                    value={formData.datosFactura}
                                                    onChange={(e) => handleChange('datosFactura', e.currentTarget.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        )}
                                    </Stack>
                                )}
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

export default SaleFormModal;