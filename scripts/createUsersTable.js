import { query } from '../src/lib/db.js';

(async () => {
  const result = await query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      phone_number VARCHAR(50),
      job VARCHAR(100),
      country VARCHAR(100)
    )
  `);

  if (result.error) {
    console.error('An error occurred:', result.error);
  } else {
    console.log('Table created successfully.');
  }
})();
