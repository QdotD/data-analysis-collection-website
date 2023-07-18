import { query } from '../src/lib/db.js';
(async () => {
  const result = await query('SELECT * FROM users LIMIT 0');

  if (result.error) {
    console.error('An error occurred:', result.error);
  } else {
    console.log('The "users" table exists.');
  }
})();
