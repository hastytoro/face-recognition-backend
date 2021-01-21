const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// handler logic:
const registerHandler = require('./routes/register');
const signinHandler = require('./routes/signin');
const profileHandler = require('./routes/profile');
const imageHandler = require('./routes/image');

// express configuration:
const app = express();
app.use(express.json());
app.use(cors());

// database configuration:
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'password',
    database: 'facedb',
  },
});

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
app.get('/', res => res.send(postmanQuery));
app.post('/signin', (req, res) => signinHandler(req, res, db, bcrypt));
app.post('/register', (req, res) => registerHandler(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profileHandler(req, res, db));
app.put('/image', (req, res) => imageHandler(req, res, db));

const PORT = 3000;
app.listen(PORT, () => console.log(`express server is running on ${PORT}`));
