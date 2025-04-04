// src/components/modals/SyncContactsModal.jsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader, FileSpreadsheet, Mail, Download, Upload } from 'lucide-react';
import { googleContactsService } from '../../services/GoogleContactsService';
import { excelService } from '../../services/ExcelService';

const SyncContactsModal = ({ opened, onClose, onContactsImported, contacts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importedContacts, setImportedContacts] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, authorizing, importing, success, error
  const [excelStatus, setExcelStatus] = useState('idle'); // idle, importing, success, error
  const fileInputRef = useRef(null);

  const handleSyncGoogle = async () => {
    try {
      setStatus('authorizing');
      setIsLoading(true);
      setError(null);

      // Iniciar la autorización con Google
      await googleContactsService.authorize();
      
      setStatus('importing');
      
      // Obtener contactos
      const contacts = await googleContactsService.getContacts();
      
      setImportedContacts(contacts);
      setStatus('success');
      
      // Notificar al componente padre
      onContactsImported(contacts);
    } catch (err) {
      console.error('Error al sincronizar contactos de Google:', err);
      setError('No se pudieron importar los contactos. Por favor, intenta de nuevo.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportTemplate = () => {
    try {
      excelService.generateTemplate();
    } catch (error) {
      console.error('Error al exportar plantilla:', error);
      setError('Error al generar la plantilla de Excel.');
    }
  };

  const handleExportContacts = () => {
    if (!contacts || contacts.length === 0) {
      setError('No hay contactos para exportar.');
      return;
    }

    try {
      excelService.exportContacts(contacts);
    } catch (error) {
      console.error('Error al exportar contactos:', error);
      setError('Error al exportar los contactos a Excel.');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelStatus('importing');
    setIsLoading(true);
    setError(null);

    try {
      const importedData = await excelService.importExcel(file);
      
      if (importedData && importedData.length > 0) {
        setImportedContacts(importedData);
        setExcelStatus('success');
        onContactsImported(importedData);
      } else {
        throw new Error('No se encontraron contactos en el archivo o el formato es incorrecto.');
      }
    } catch (err) {
      console.error('Error al importar Excel:', err);
      setError(typeof err === 'string' ? err : 'Error al procesar el archivo Excel.');
      setExcelStatus('error');
    } finally {
      setIsLoading(false);
      // Limpiar el input para permitir cargar el mismo archivo varias veces
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {opened && (
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
                Importar/Exportar Contactos
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
                <div className="space-y-8">
                  {/* Error general */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-start">
                      <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-red-800 font-medium">Error</p>
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Sección de Google Contacts */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Mail className="text-red-500 mr-3" size={24} />
                        <h3 className="text-lg font-medium">Sincronizar con Google Contacts</h3>
                      </div>
                      <button
                        onClick={handleSyncGoogle}
                        disabled={isLoading && status !== 'idle'}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isLoading && status !== 'idle' ? (
                          <>
                            <Loader className="animate-spin mr-2" size={16} />
                            {status === 'authorizing' ? 'Autorizando...' : 'Importando...'}
                          </>
                        ) : 'Sincronizar'}
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      Importa tus contactos desde Google para tenerlos disponibles en el sistema.
                      Se te pedirá autorización para acceder a tus contactos.
                    </p>
                    
                    {status === 'success' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-start">
                        <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-green-800 font-medium">Importación exitosa</p>
                          <p className="text-green-700 text-sm">
                            Se importaron {importedContacts.length} contactos correctamente desde Google Contacts.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sección de Excel - Importar */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Upload className="text-blue-600 mr-3" size={24} />
                      <h3 className="text-lg font-medium">Importar desde Excel</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Importa tus contactos desde un archivo Excel utilizando una plantilla estandarizada.
                      Asegúrate de mantener el formato de la plantilla para una importación exitosa.
                    </p>
                    
                    <div className="flex gap-4 mb-4">
                      <button
                        onClick={handleExportTemplate}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 flex items-center gap-2"
                      >
                        <Download size={16} />
                        Descargar Plantilla
                      </button>
                      
                      <button
                        onClick={handleFileSelect}
                        disabled={isLoading && excelStatus !== 'idle'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading && excelStatus !== 'idle' ? (
                          <>
                            <Loader className="animate-spin" size={16} />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Importar Excel
                          </>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    {excelStatus === 'success' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-start">
                        <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-green-800 font-medium">Importación exitosa</p>
                          <p className="text-green-700 text-sm">
                            Se importaron {importedContacts.length} contactos correctamente desde Excel.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sección de Excel - Exportar */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <FileSpreadsheet className="text-green-600 mr-3" size={24} />
                      <h3 className="text-lg font-medium">Exportar a Excel</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Exporta todos tus contactos actuales a un archivo Excel
                      para hacer copias de seguridad o utilizarlos en otras aplicaciones.
                    </p>
                    
                    <button
                      onClick={handleExportContacts}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Exportar Contactos
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SyncContactsModal;