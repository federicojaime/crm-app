// src/components/contacts/ContactActions.jsx
const ContactActions = () => {
    const actions = [
        { icon: Plus, label: 'Nota' },
        { icon: Mail, label: 'Correo' },
        { icon: Phone, label: 'Llamada' },
        { icon: Calendar, label: 'Tarea' },
        { icon: Users, label: 'Reunión' },
    ];

    return (
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50">
            {actions.map((action) => (
                <button
                    key={action.label}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                    <action.icon size={16} />
                    {action.label}
                </button>
            ))}
        </div>
    );
};
