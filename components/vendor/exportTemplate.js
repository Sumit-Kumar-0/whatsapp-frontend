import * as XLSX from 'xlsx';

export const downloadContactTemplate = () => {
  // Sample data for template
  const templateData = [
    {
      'First Name*': 'John',
      'Last Name': 'Doe',
      'Country Code*': '+91',
      'Phone Number*': '9876543210',
      'Country*': 'India',
      'Email': 'john.doe@example.com',
      'Company': 'ABC Corp',
      'Category': 'customer',
      'Tags': 'client,vip',
      'Source': 'website',
      'Notes': 'Important client'
    },
    {
      'First Name*': 'Jane',
      'Last Name': 'Smith',
      'Country Code*': '+1',
      'Phone Number*': '5551234567',
      'Country*': 'United States',
      'Email': 'jane.smith@example.com',
      'Company': 'XYZ Inc',
      'Category': 'lead',
      'Tags': 'prospect',
      'Source': 'referral',
      'Notes': 'Follow up next week'
    }
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(templateData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Contacts Template');
  
  // Generate and download file
  XLSX.writeFile(wb, 'contact_template.xlsx');
};

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Invalid Excel file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};