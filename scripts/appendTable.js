import { query } from '../src/lib/db.js';
(async () => {
    const result = await query(`
      ALTER TABLE users
      ADD COLUMN SalaryUSD VARCHAR(10)
    `);
  
    if (result.error) {
      console.error('An error occurred:', result.error);
    } else {
      console.log('SalaryUSD column added successfully.');
    }
  })();
  