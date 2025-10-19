const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const inputFile = './data/xauusd_w.csv';
const outputFile = './data/weekly_xau.json';

if (!fs.existsSync(inputFile)) {
  console.error('❌ Error: Input file not found');
  process.exit(1);
}

const cleanNumber = (str) => {
  if (!str || typeof str !== 'string') return null;
  // Remove any non-numeric characters except decimal point and minus sign
  return parseFloat(str.replace(/[^0-9.-]+/g, '')) || null;
};

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('headers', (headers) => {
    console.log('CSV Headers:', headers); // Log column names for verification
  })
  .on('data', (data) => {
   
    results.push({
      date: data.Date,
      open: cleanNumber(data.Open),
      high: cleanNumber(data.High),
      low: cleanNumber(data.Low),
      close: cleanNumber(data.Close) 
    });
  })
  .on('end', () => {
    try {
      fs.writeFileSync(outputFile, JSON.stringify(results.reverse(), null, 2));
      console.log('✅ Converted to JSON:', outputFile);
    } catch (err) {
      console.error('❌ Error writing JSON:', err.message);
    }
  })
  .on('error', (err) => {
    console.error('❌ Error reading CSV:', err.message);
  });