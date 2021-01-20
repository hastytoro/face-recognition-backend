const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'password',
    database: 'facedb',
  },
});

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

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then(data => res.json(data));
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json('unable to signin user.'));
      } else {
        res.status(400).json('wrong credentials.');
      }
    })
    .catch(err => res.status(400).json('wrong credentials.'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then(user => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('unable to register user.'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({
      id: id,
    })
    .then(user => {
      if (user.length) res.json(user[0]);
      else res.status(400).json('user not found');
    })
    .catch(err => res.status(400).json('error getting user profile.'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('error getting user entries.'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`express server is running on ${PORT}`));
