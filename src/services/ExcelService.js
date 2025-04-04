// src/services/ExcelService.js
import * as XLSX from 'xlsx';

/**
 * Servicio para manejar la exportación e importación de archivos Excel
 * relacionados con contactos y clientes
 */
class ExcelService {
  /**
   * Genera y descarga una plantilla Excel para importar contactos
   */
  generateTemplate() {
    try {
      // Crear un nuevo libro de trabajo (workbook)
      const wb = XLSX.utils.book_new();
      
      // Definir los encabezados de la plantilla
      const headers = [
        "Nombre",
        "Apellido",
        "Email",
        "Teléfono",
        "Dirección",
        "Empresa",
        "Cargo",
        "Origen",
        "Notas"
      ];
      
      // Crear algunos datos de ejemplo para facilitar la comprensión
      const exampleData = [
        ["Juan", "Pérez", "juan.perez@example.com", "+5491123456789", "Buenos Aires, Argentina", "Empresa ABC", "Gerente", "Recomendación", "Cliente potencial interesado en producto X"],
        ["María", "López", "maria.lopez@example.com", "+5491187654321", "Córdoba, Argentina", "Empresa XYZ", "Directora", "Sitio Web", "Contactada en la feria comercial"]
      ];
      
      // Combinar encabezados y datos de ejemplo
      const wsData = [headers, ...exampleData];
      
      // Crear una hoja de cálculo (worksheet)
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Estilizar cabeceras (más ancho para las columnas)
      const colWidths = [
        { wch: 15 }, // Nombre
        { wch: 15 }, // Apellido
        { wch: 30 }, // Email
        { wch: 20 }, // Teléfono
        { wch: 30 }, // Dirección
        { wch: 20 }, // Empresa
        { wch: 15 }, // Cargo
        { wch: 15 }, // Origen
        { wch: 50 }  // Notas
      ];
      
      ws['!cols'] = colWidths;
      
      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, "Contactos");
      
      // Generar el archivo y descargarlo
      XLSX.writeFile(wb, "plantilla_contactos.xlsx");
      
      return true;
    } catch (error) {
      console.error("Error al generar la plantilla Excel:", error);
      return false;
    }
  }

  /**
   * Procesa un archivo Excel de contactos y lo convierte al formato de la aplicación
   * @param {File} file - El archivo Excel a procesar
   * @returns {Promise<Array>} - Promesa que resuelve a un array de objetos de contacto
   */
  async importExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const wb = XLSX.read(data, { type: 'array' });
          
          // Obtener la primera hoja
          const firstSheetName = wb.SheetNames[0];
          const ws = wb.Sheets[firstSheetName];
          
          // Convertir la hoja a un array de objetos
          const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          
          // Extraer cabeceras (primera fila)
          const headers = rawData[0];
          
          // Validar que el formato sea el esperado
          const requiredHeaders = ["Nombre", "Apellido", "Email"];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            reject(`Formato inválido: Faltan los encabezados ${missingHeaders.join(", ")}`);
            return;
          }
          
          // Convertir a nuestro formato de datos
          const contacts = rawData.slice(1).map((row, index) => {
            // Mapear cada fila a un objeto según los encabezados
            const contact = {};
            headers.forEach((header, i) => {
              contact[header] = row[i] || '';
            });
            
            // Convertir al formato de nuestra aplicación
            return {
              id: `imported_${index + 1}`,
              nombre: contact.Nombre || '',
              apellido: contact.Apellido || '',
              email: contact.Email || '',
              telefono: contact.Teléfono || contact.Telefono || '',
              direccion: contact.Dirección || contact.Direccion || '',
              empresa: contact.Empresa || '',
              cargo: contact.Cargo || '',
              source: contact.Origen || 'Importación Excel',
              estado: 'Activo',
              lastContact: new Date().toISOString().substring(0, 10),
              fecha_creacion: new Date().toISOString().substring(0, 10),
              etapa: 'Prospecto',
              notas: contact.Notas || ''
            };
          });
          
          resolve(contacts);
        } catch (error) {
          console.error("Error al procesar el archivo Excel:", error);
          reject("Ha ocurrido un error al procesar el archivo. Asegúrate de que sea un archivo Excel válido.");
        }
      };
      
      reader.onerror = () => {
        reject("Error al leer el archivo.");
      };
      
      // Leer el archivo como un ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Exporta los contactos actuales a un archivo Excel
   * @param {Array} contacts - Lista de contactos a exportar
   */
  exportContacts(contacts) {
    try {
      // Crear un nuevo libro de trabajo
      const wb = XLSX.utils.book_new();
      
      // Definir los encabezados
      const headers = [
        "Nombre",
        "Apellido",
        "Email",
        "Teléfono",
        "Dirección",
        "Empresa",
        "Origen",
        "Estado",
        "Último Contacto",
        "Fecha Creación",
        "Etapa"
      ];
      
      // Convertir los contactos al formato para Excel
      const data = contacts.map(contact => [
        contact.nombre,
        contact.apellido,
        contact.email,
        contact.telefono,
        contact.direccion,
        contact.empresa || '',
        contact.source,
        contact.estado,
        contact.lastContact,
        contact.fecha_creacion,
        contact.etapa
      ]);
      
      // Combinar encabezados y datos
      const wsData = [headers, ...data];
      
      // Crear una hoja de cálculo
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Estilizar cabeceras (más ancho para las columnas)
      const colWidths = [
        { wch: 15 }, // Nombre
        { wch: 15 }, // Apellido
        { wch: 30 }, // Email
        { wch: 20 }, // Teléfono
        { wch: 30 }, // Dirección
        { wch: 20 }, // Empresa
        { wch: 15 }, // Origen
        { wch: 15 }, // Estado
        { wch: 15 }, // Último Contacto
        { wch: 15 }, // Fecha Creación
        { wch: 15 }  // Etapa
      ];
      
      ws['!cols'] = colWidths;
      
      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, "Contactos");
      
      // Generar el archivo y descargarlo
      XLSX.writeFile(wb, "contactos_exportados.xlsx");
      
      return true;
    } catch (error) {
      console.error("Error al exportar contactos a Excel:", error);
      return false;
    }
  }
}

export const excelService = new ExcelService();