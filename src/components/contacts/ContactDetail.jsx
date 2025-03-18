// src/components/contacts/ContactDetail.jsx
import React, { useState } from 'react';
import ContactHeader from './ContactHeader';
import ContactInfo from './ContactInfo';
import ContactTabs from './ContactTabs';
import ContactTimeline from './ContactTimeline';
import ContactActions from './ContactActions';

const ContactDetail = ({ contact }) => {
    const [activeTab, setActiveTab] = useState('info');

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
            <ContactHeader contact={contact} />
            <ContactActions />
            <div className="flex-1 overflow-auto">
                <ContactTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="p-6">
                    {activeTab === 'info' && <ContactInfo contact={contact} />}
                    {activeTab === 'timeline' && <ContactTimeline contactId={contact.id} />}
                </div>
            </div>
        </div>
    );
};