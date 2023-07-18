import { query } from '../src/lib/db.js';

(async () => {
    const result = await query(`
      ALTER TABLE users
      DROP COLUMN salary
    `);
  
    if (result.error) {
      console.error('An error occurred:', result.error);
    } else {
      console.log('Salary column removed successfully.');
    }
  })();
  