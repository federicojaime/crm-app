// src/components/SaleFormModal.jsx
import { useState, useEffect } from 'react';
import {
    Modal,
    Button,
    TextInput,
    NumberInput,
    Select,
    MultiSelect,
    Checkbox,
    Textarea,
    Group,
    Stack,
    Grid,
    Divider,
    Text,
    Tabs
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconCurrencyDollar } from '@tabler/icons-react';

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
        // Generar ID si es nueva venta
        const saleData = {
            ...formData,
            id: formData.id || Date.now(),
        };
        onSave(saleData);
        onClose();
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Orden de Compra - INSIGHT"
            size="xl"
            fullScreen
        >
            <Tabs value={activeTab} onTabChange={setActiveTab}>
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

                {/* Pestaña de Datos del Cliente */}
                <Tabs.Panel value="cliente" pt="md">
                    <Stack spacing="md">
                        <DatePicker
                            label="Fecha de la Venta"
                            placeholder="Seleccionar fecha"
                            required
                            value={formData.fecha instanceof Date ? formData.fecha : new Date(formData.fecha)}
                            onChange={(value) => handleChange('fecha', value)}
                        />

                        <Select
                            label="Vendedor/a"
                            placeholder="Seleccionar vendedor"
                            required
                            data={sellers}
                            value={formData.vendedor}
                            onChange={(value) => handleChange('vendedor', value)}
                            description="Si figura más de un vendedor en la orden, seleccionar uno y aclarar en observaciones"
                        />

                        <Select
                            label="¿De dónde fue extraído el prospecto?"
                            placeholder="Seleccionar origen"
                            required
                            data={[
                                { value: 'referido', label: 'Referido' },
                                { value: 'base', label: 'Base de datos' },
                                { value: 'exhibicion', label: 'Exhibición' },
                                { value: 'digital', label: 'Marketing Digital' },
                                { value: 'otro', label: 'Otro' }
                            ]}
                            value={formData.origen}
                            onChange={(value) => handleChange('origen', value)}
                        />

                        {formData.origen === 'referido' && (
                            <TextInput
                                label="Nombre y apellido de la persona que refirió"
                                placeholder="Ingrese el nombre completo"
                                value={formData.referido}
                                onChange={(e) => handleChange('referido', e.currentTarget.value)}
                                description="Completar si el dato extraído es de un programa de regalos"
                            />
                        )}

                        <Group grow>
                            <Checkbox
                                label="¿Es agregado?"
                                checked={formData.esAgregado}
                                onChange={(e) => handleChange('esAgregado', e.currentTarget.checked)}
                            />
                        </Group>

                        <TextInput
                            label="Nombre y Apellido del Cliente"
                            placeholder="Ingrese nombre y apellido en mayúsculas"
                            required
                            value={formData.clienteNombre}
                            onChange={(e) => handleChange('clienteNombre', e.currentTarget.value.toUpperCase())}
                        />
                    </Stack>
                </Tabs.Panel>

                {/* Pestaña de Productos */}
                <Tabs.Panel value="productos" pt="md">
                    <Tabs defaultValue="juegos">
                        <Tabs.List>
                            <Tabs.Tab value="juegos">Juegos</Tabs.Tab>
                            <Tabs.Tab value="ollas">Ollas</Tabs.Tab>
                            <Tabs.Tab value="sartenes">Sartenes</Tabs.Tab>
                            <Tabs.Tab value="otros">Otros Productos</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="juegos" pt="md">
                            <MultiSelect
                                label="Juegos"
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
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="ollas" pt="md">
                            <Grid>
                                <Grid.Col span={6}>
                                    <MultiSelect
                                        label="Ollas Individuales"
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
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <MultiSelect
                                        label="Ollas a Presión"
                                        placeholder="Seleccionar ollas a presión vendidas"
                                        data={[
                                            { value: 'presion_6l', label: 'Olla a presión 6lts' },
                                            { value: 'presion_10l', label: 'Olla a presión 10 lts' }
                                        ]}
                                        value={formData.productos.ollaPresion}
                                        onChange={(value) => handleChange('productos.ollaPresion', value)}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Tabs.Panel>

                        <Tabs.Panel value="sartenes" pt="md">
                            <MultiSelect
                                label="Sartenes"
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
                            />
                        </Tabs.Panel>

                        <Tabs.Panel value="otros" pt="md">
                            <Grid>
                                <Grid.Col span={6}>
                                    <MultiSelect
                                        label="Coladores"
                                        placeholder="Seleccionar coladores vendidos"
                                        data={[
                                            { value: 'colador_grande', label: 'Colador Grande 26cm' },
                                            { value: 'colador_pequeño', label: 'Colador Pequeño 20cm' }
                                        ]}
                                        value={formData.productos.coladores}
                                        onChange={(value) => handleChange('productos.coladores', value)}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <MultiSelect
                                        label="Planchas"
                                        placeholder="Seleccionar planchas vendidas"
                                        data={[
                                            { value: 'plancha_doble', label: 'Plancha Doble RP' },
                                            { value: 'plancha_redonda', label: 'Plancha redonda' },
                                            { value: 'plancha_sencilla', label: 'Plancha sencilla' }
                                        ]}
                                        value={formData.productos.planchas}
                                        onChange={(value) => handleChange('productos.planchas', value)}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <MultiSelect
                                        label="Extractores y otros"
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
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <MultiSelect
                                        label="Cuchillos y otros"
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
                                    />
                                </Grid.Col>
                            </Grid>
                        </Tabs.Panel>
                    </Tabs>

                    <Divider my="sm" />
                    
                    <Textarea
                        label="Observaciones sobre productos vendidos"
                        placeholder="Ej: 'Se vendió un combo personalizado', 'Cliente prefiere color rojo', etc."
                        minRows={3}
                        value={formData.observacionesProductos}
                        onChange={(e) => handleChange('observacionesProductos', e.currentTarget.value)}
                    />
                </Tabs.Panel>

                {/* Pestaña de Pago */}
                <Tabs.Panel value="pago" pt="md">
                    <Stack spacing="md">
                        <NumberInput
                            label="Precio de lista"
                            placeholder="Ingrese el precio de lista"
                            required
                            min={0}
                            icon={<IconCurrencyDollar size={16} />}
                            value={formData.precioLista}
                            onChange={(value) => handleChange('precioLista', value)}
                            description="Número sin coma ni punto"
                        />

                        <Select
                            label="Modalidad de pago"
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
                        />

                        {formData.modalidadPago === 'financiado' && (
                            <>
                                <Select
                                    label="Cantidad de cuotas"
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
                                />

                                <NumberInput
                                    label="Valor de la cuota"
                                    placeholder="Ingrese el valor de la cuota"
                                    min={0}
                                    icon={<IconCurrencyDollar size={16} />}
                                    value={formData.valorCuota}
                                    onChange={(value) => handleChange('valorCuota', value)}
                                    description="Número sin coma ni punto (0 si es de contado)"
                                />
                            </>
                        )}

                        <NumberInput
                            label="Anticipo acordado"
                            placeholder="Ingrese el anticipo acordado"
                            required
                            min={0}
                            icon={<IconCurrencyDollar size={16} />}
                            value={formData.anticipoAcordado}
                            onChange={(value) => handleChange('anticipoAcordado', value)}
                            description="Valor TOTAL del anticipo, aunque haya sido entregado de forma parcial"
                        />

                        <NumberInput
                            label="Deuda del anticipo/contado"
                            placeholder="Ingrese la deuda pendiente"
                            required
                            min={0}
                            icon={<IconCurrencyDollar size={16} />}
                            value={formData.deudaAnticipo}
                            onChange={(value) => handleChange('deudaAnticipo', value)}
                            description="Colocar 0 si el cliente entregó el 100% del anticipo"
                        />

                        <DatePicker
                            label="Fecha de cobro del anticipo total o el pago de la 2° entrega de contado"
                            placeholder="Seleccionar fecha"
                            required
                            value={formData.fechaCobroTotal instanceof Date ? formData.fechaCobroTotal : new Date(formData.fechaCobroTotal)}
                            onChange={(value) => handleChange('fechaCobroTotal', value)}
                            description="Si está 100% saldado, colocar la fecha de venta. Si es contraentrega, aprox. 15 días después"
                        />
                    </Stack>
                </Tabs.Panel>

                {/* Pestaña de Otros Datos */}
                <Tabs.Panel value="otros" pt="md">
                    <Stack spacing="md">
                        <Group grow>
                            <Checkbox
                                label="¿Hubo regalo de cierre?"
                                checked={formData.regaloVenta}
                                onChange={(e) => handleChange('regaloVenta', e.currentTarget.checked)}
                            />
                        </Group>

                        {formData.regaloVenta && (
                            <TextInput
                                label="Detalle del regalo"
                                placeholder="Describa el regalo ofrecido"
                                value={formData.detalleRegalo}
                                onChange={(e) => handleChange('detalleRegalo', e.currentTarget.value)}
                            />
                        )}

                        <Textarea
                            label="Observaciones"
                            placeholder="Ej: 'Cliente requiere factura', 'Pago con cheques', etc."
                            minRows={4}
                            value={formData.observaciones}
                            onChange={(e) => handleChange('observaciones', e.currentTarget.value)}
                        />

                        <Group grow>
                            <Checkbox
                                label="¿Requiere factura?"
                                checked={formData.requiereFactura}
                                onChange={(e) => handleChange('requiereFactura', e.currentTarget.checked)}
                            />
                        </Group>

                        {formData.requiereFactura && (
                            <TextInput
                                label="Datos para facturación"
                                placeholder="CUIT, razón social y tipo de factura"
                                value={formData.datosFactura}
                                onChange={(e) => handleChange('datosFactura', e.currentTarget.value)}
                            />
                        )}
                    </Stack>
                </Tabs.Panel>
            </Tabs>

            <Group position="right" mt="xl">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit}>Guardar Orden de Compra</Button>
            </Group>
        </Modal>
    );
};

export default SaleFormModal;