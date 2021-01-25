const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// handler logic:
const registerHandler = require('./routes/register');
const signinHandler = require('./routes/signin');
const profileHandler = require('./routes/profile');
const imageHandler = require('./routes/image');

// database configuration:
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// express configuration:
const app = express();
app.use(express.json());
app.use(cors());

// sample query:
const postmanQuery = {
  // use the following examples:
  users: [
    {
      name: 'bond',
      email: 'jamesbond@mi6.gov',
      password: 'skyFall',
    },
    {
      name: 'mallory',
      email: 'garethmallory@mi6.gov',
      password: 'skyFall',
    },
  ],
};

// express routes:
app.get('/', (req, res) => res.send('its working!'));
app.post('/signin', (req, res) => signinHandler(req, res, db, bcrypt));
app.post('/register', (req, res) => registerHandler(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profileHandler(req, res, db));
app.put('/image', (req, res) => imageHandler(req, res, db));

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => console.log(`app is running on port ${PORT}`));
