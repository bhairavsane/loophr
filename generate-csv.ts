import fs from 'fs';
import { seedCases } from './src/lib/data/seed-cases';
import Papa from 'papaparse';

const csv = Papa.unparse(seedCases);
fs.writeFileSync('hr_cases_2026.csv', csv);
console.log('Generated hr_cases_2026.csv with ' + seedCases.length + ' cases.');
