// src/components/contacts/ContactTabs.jsx
const ContactTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
      { id: 'info', label: 'Información' },
      { id: 'timeline', label: 'Actividades' },
      { id: 'deals', label: 'Oportunidades' },
      { id: 'files', label: 'Archivos' },
    ];
  
    return (
      <div className="border-b border-gray-100">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };