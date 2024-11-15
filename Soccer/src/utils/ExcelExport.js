import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (dataObject, fileName) => {
  const data = [];
  const headers = new Set();

  // Coletar Dados e Cabeçalhos para o Export
  dataObject.forEach(entry => {
    const row = {};
    Object.entries(entry).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.entries(value).forEach(([innerKey, innerValue]) => {
          row[innerKey] = innerValue;
          headers.add(innerKey);
        });
      } else {
        row[key] = value;
        headers.add(key);
      }
    });
    data.push(row);
  });

  const worksheet = XLSX.utils.json_to_sheet(data, { header: Array.from(headers) });
  const workbook = {
    Sheets: { 'Data': worksheet },
    SheetNames: ['Data'],
  };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(dataBlob, `${fileName}.xlsx`);
};