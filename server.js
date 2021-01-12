const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '007',
      name: 'bond',
      email: 'jamesbond@mi6.gov',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '123',
      name: 'mallory',
      email: 'garethmallory@mi6.gov',
      password: 'chairman',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => res.send(database.users));

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(400).json('denied');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, (err, hash) => console.log(hash));
  database.users.push({
    id: '123',
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let isFound = false;
  database.users.map(user => {
    if (user.id === id) {
      isFound = true;
      res.json(user);
    }
  });
  if (!isFound) res.status(400).json('user not found');
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let isFound = false;
  database.users.map(user => {
    if (user.id === id) {
      isFound = true;
      user.entries++;
      res.json(user.entries);
    }
  });
  if (!isFound) res.status(400).json('user not found');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`express server is running on ${PORT}`));
