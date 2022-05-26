const http = require('http');
const express = require('express');
const app = express();
const Pool = require('pg').Pool;

const hostname = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

// Postgres connection details
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || '127.0.0.1',
  database: process.env.PGDATABASE || 'postgres',
  password: process.env.PGPASS || 'test',
  port: process.env.PGPORT || 5432
});

// If the client fails to connect, stop the process
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    process.exit(-1);
  }
});

// data will be an object literal that defines the data structure with expected key/values
const data = {
  "id": null,
  "loan_id": null,
  "amount": null,
  "interest_rate": null,
  "months": null,
  "payment": null
}

// for parsing application/json
app.use(express.json());

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', (req, res) => {
  res.sendFile('index.html' , { root : __dirname});
});

/*
  GET /v1/loan/:loan_id
  Get a loan based on its loan_id
*/
app.get('/v1/loan/:loan_id', (req, res) => {
  // Read loan_id from the URL
  data.loan_id = req.params.loan_id;

  // define the query and parameters
  const text = 'SELECT loan_id, amount, interest_rate, months, payment FROM loans WHERE loan_id = $1';
  const values = [data.loan_id];

  // GET the data from the database
  pool.query(text, values, (err, pg_res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(pg_res.rows[0]);

      if (pg_res.rows[0] == undefined) {
        // 404 if not found
        res.status(404);
        res.send('Loan not found');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.body = pg_res.rows[0];
        res.send(res.body);
      }
    }
  });
});

/*
  POST /v1/loan
  Create a new loan
*/
app.post('/v1/loan', (req, res) => {
  
  data.loan_id = generateID();
  data.amount = req.body.amount;;
  data.interest_rate = req.body.interest_rate;
  data.months = req.body.months;
  data.payment = req.body.payment;

  // define the query and parameters
  const text = 'INSERT INTO loans(loan_id, amount, interest_rate, months, payment) VALUES($1, $2, $3, $4, $5) RETURNING loan_id, amount, interest_rate, months, payment';
  const values = [data.loan_id, data.amount, data.interest_rate, data.months, data.payment];

  // POST data to the database
  pool.query(text, values, (err, pg_res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(pg_res.rows[0]);
      res.statusCode = 201;
      res.location('/loan/' + pg_res.rows[0].loan_id);
      res.setHeader('Content-Type', 'application/json');
      res.body = pg_res.rows[0];
      res.send(res.body);
    }
  });
});


/*
  PUT /v1/loan/:loan_id
  Edit a loan based on its loan_id
*/
app.put('/v1/loan/:loan_id', (req, res) => {

  data.loan_id = req.params.loan_id;
  data.amount = req.body.amount;;
  data.interest_rate = req.body.interest_rate;
  data.months = req.body.months;
  data.payment = req.body.payment;

  // define the query and parameters
  const text = 'UPDATE loans SET amount = $2, interest_rate = $3, months = $4, payment = $5 WHERE loan_id = $1 RETURNING loan_id, amount, interest_rate, months, payment';
  const values = [data.loan_id, data.amount, data.interest_rate, data.months, data.payment];

  // PUT data in the database
  pool.query(text, values, (err, pg_res) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (pg_res.rows[0] == undefined) {
        // 404 if not found
        res.status(404);
        res.send('Loan not found');
      } else {
        console.log(pg_res.rows[0]);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.body = pg_res.rows[0];
        res.send(res.body);
      }
    }
  });
});

/*
  Create a random 16 digit ID
*/
function generateID() {
  return [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}
