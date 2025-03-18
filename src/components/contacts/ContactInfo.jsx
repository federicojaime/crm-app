// src/components/contacts/ContactInfo.jsx
const ContactInfo = ({ contact }) => {
    return (
        <div className="space-y-6">
            <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Información de contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                        icon={Mail}
                        label="Correo electrónico"
                        value={contact.email}
                    />
                    <InfoItem
                        icon={Phone}
                        label="Teléfono"
                        value={contact.phone}
                    />
                    <InfoItem
                        icon={Building}
                        label="Empresa"
                        value={contact.company}
                    />
                    {/* Más campos de información */}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Detalles adicionales
                </h2>
                {/* Más secciones de información */}
            </section>
        </div>
    );
};