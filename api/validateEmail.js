import { query } from '../src/lib/db.js';

export default async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const queryText = 'SELECT * FROM users WHERE email = $1';
    const result = await query(queryText, [email]);

    res.json({ exists: result.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while checking the email');
  }
};
