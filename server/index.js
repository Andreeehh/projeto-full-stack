const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv/config');

const app = express();
const port = process.env.PORT_SERVER || 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM products WHERE code = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Produto não encontrado');
      return;
    }
    console.log(result);
    res.send(result[0]);
  });
});

app.get('/packs/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM packs WHERE product_id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Pack não encontrado');
      return;
    }
    console.log(result);
    res.send(result[0]);
  });
});

app.get('/packs/', (req, res) => {
  const sql = 'SELECT * FROM packs';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(result);
    res.send(result);
  });
});

app.get('/products/', (req, res) => {
  const sql = 'SELECT * FROM products';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(result);
    res.send(result);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/update-products', (req, res) => {
  const { products } = req.body;
  const updatePromises = products.map((product) => {
    return new Promise((resolve, reject) => {
      const { code, sales_price } = product;
      const sql = 'UPDATE products SET sales_price = ? WHERE code = ?';
      connection.query(sql, [sales_price, code], (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          console.log(result);
          resolve();
        }
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.send('Produtos atualizados com sucesso');
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
