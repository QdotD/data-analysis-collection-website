import { query } from '../src/lib/db.js';

(async () => {
    const result = await query(`
      DELETE FROM users
    `);
  
    if (result.error) {
      console.error('An error occurred:', result.error);
    } else {
      console.log('Data deleted successfully.');
    }
  })();
  