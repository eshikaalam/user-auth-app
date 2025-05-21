require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const mysql      = require('mysql2');

const app = express();
app.use(bodyParser.json());

// Connect to local MySQL
const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL');
});

// REGISTER endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('username & password required');
  }
  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    err => {
      if (err) return res.status(500).send(err.message);
      res.send('User registered');
    }
  );
});

// LOGIN endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).send(err.message);
      if (results.length) return res.send('Login successful');
      res.status(401).send('Invalid credentials');
    }
  );
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
