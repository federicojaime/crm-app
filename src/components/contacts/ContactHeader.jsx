// src/components/contacts/ContactHeader.jsx
import { User, Mail, Phone, Building } from 'lucide-react';
import Avatar from '../shared/Avatar';

const ContactHeader = ({ contact }) => {
    return (
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Avatar
                        name={contact.name}
                        size="lg"
                        className="bg-blue-100 text-blue-600"
                    />
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {contact.name}
                        </h1>
                        <p className="text-gray-500">{contact.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full">
                        <Mail size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full">
                        <Phone size={20} />
                    </button>
                    <div className="relative group">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full">
                            <MoreVertical size={20} />
                        </button>
                        {/* Menú desplegable */}
                    </div>
                </div>
            </div>
        </div>
    );
};