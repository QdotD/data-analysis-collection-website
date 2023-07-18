import { query } from '../src/lib/db.js';

(async () => {
  const result = await query('SELECT * FROM users');

  if (result.error) {
    console.error('An error occurred:', result.error);
  } else {
    console.log('All users:', result.rows);
  }
})();
