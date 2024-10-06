require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Hospital_db');
});

// Q.1 Retrieve all patients
app.get('/patients', (req, res) => {
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Q.2 Retrieve all providers
app.get('/providers', (req, res) => {
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Q.3 Filter patients by first name
app.get('/patients/search', (req, res) => {
  const { first_name } = req.query;
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

  db.query(sql, [first_name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Q.4 Retrieve providers by specialty
app.get('/providers/search', (req, res) => {
  const { specialty } = req.query;
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

  db.query(sql, [specialty], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });

});
// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/data', (req, res) => {
    // Retrieve data from database
    db.query('SELECT * FROM patients', (err, results) => {
        if (err){
            console.log(err);
            res.status(500).send('error retrieving data');
        }else {
            // display the records to the browser
            res.render('data', {results: results});
        }
    })
    const sql = 'SELECT patient_id, first_name FROM patients';
  
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // Render the EJS view and pass the results
      res.render('patients', { results });
    });
  });
  
// Start the server
const PORT = 3300;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
