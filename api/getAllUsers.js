import { query } from '../src/lib/db.js';

export default async (req, res) => {
  try {
    const result = await query('SELECT * FROM users');
    if (result.error) {
      throw new Error(result.error);
    }
    res.status(200).json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message || 'An error occurred while fetching the users.' });
  }
};
