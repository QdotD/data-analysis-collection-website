import { query } from '../src/lib/db.js';
import validator from 'validator';

export default async (req, res) => {
  console.log('request: ', req.body);

  let { firstName, lastName, age, email, phoneNumber, job, country, SalaryUSD } = req.body;

  // Sanitize the inputs (remove any HTML and trim whitespace):
  firstName = validator.escape(validator.trim(firstName));
  lastName = validator.escape(validator.trim(lastName));
  email = validator.escape(validator.trim(email));
  phoneNumber = validator.escape(validator.trim(phoneNumber));
  job = validator.escape(validator.trim(job));
  country = validator.escape(validator.trim(country));

  // Check if age and SalaryUSD are numeric
  if (!validator.isNumeric(String(age)) || !validator.isNumeric(String(SalaryUSD))) {
    res.status(400).send({
      message: 'Age and SalaryUSD must be numeric.',
      success: false,
    });
    return;
  }

  // Validate the inputs:
  if (!validator.isEmail(email)) {
    res.status(400).send({
      message: 'Invalid email address.',
      success: false,
    });
    return;
  }

  // You can add more validation rules here as needed...

  // Execute the query and handle any errors...
  try {
    const result = await query('INSERT INTO users (first_name, last_name, age, email, phone_number, job, country, SalaryUSD) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [firstName, lastName, Number(age), email, phoneNumber, job, country, Number(SalaryUSD)]);

    if (result.error) {
      throw new Error(result.error);
    }

    res.status(200).send({
      message: 'Form submitted successfully.',
      success: true,
    });
  } catch (error) {
    console.error('An error occurred:', error);

    res.status(500).send({
      message: 'An error occurred while submitting the form.',
      success: false,
    });
  }
}