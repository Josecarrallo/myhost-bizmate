// Quick script to read Nismara Uma occupancy Excel
const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('C:/myhost-bizmate/MYHOST Bizmate_Documentos_Estrategicos 2025_2026/NISMARA UMA VILLA OCCUPANCY.xlsx');

  console.log('SHEETS:', workbook.SheetNames);

  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== SHEET: ${sheetName} ===`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log(`Rows: ${data.length}`);
    console.log('\nFIRST 30 ROWS:');
    data.slice(0, 30).forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, row);
    });
  });
} catch (error) {
  console.error('Error:', error.message);
}
