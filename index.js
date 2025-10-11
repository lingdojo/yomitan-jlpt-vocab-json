const csv = require('csvtojson');
const fs = require('fs/promises'); // Use the promise-based fs module for async/await
const path = require('path');

// List of CSV files to process (assuming they are in a 'data' folder)
const csvFiles = [
  'original_data/n3.csv',
  'original_data/n2.csv',
  'original_data/n1.csv'
];

/**
 * Converts a single CSV file to JSON and writes it to the root directory.
 * @param {string} csvFilePath - The path to the input CSV file.
 */
async function convertAndWrite(csvFilePath) {
  try {
    // 1. Convert CSV to JSON object array
    const jsonArray = await csv().fromFile(csvFilePath);

    // 2. Prepare the output filename
    // Get the base name (e.g., 'products')
    const fileName = path.basename(csvFilePath, '.csv');
    // Construct the output path for the JSON file at the root
    const outputFilePath = path.join(process.cwd(), `${fileName}.json`);

    // 3. Stringify the JSON array with nice formatting (2 spaces)
    const jsonString = JSON.stringify(jsonArray, null, 2);

    // 4. Write the JSON string to the new file
    await fs.writeFile(outputFilePath, jsonString, 'utf8');

    console.log(
      `✅ Successfully converted ${csvFilePath} to ${path.basename(
        outputFilePath
      )}`
    );
  } catch (error) {
    console.error(`❌ Failed to process ${csvFilePath}:`, error.message);
  }
}

async function processAllFiles() {
  console.log('Starting CSV to JSON conversion...');

  // Create an array of Promises, one for each file conversion
  const conversionPromises = csvFiles.map(convertAndWrite);

  // Wait for all promises to resolve
  await Promise.all(conversionPromises);

  console.log('All conversions complete.');
}

processAllFiles();
