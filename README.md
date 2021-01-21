// database configuration from sever.js:
const db = knex({
client: 'pg',
connection: {
host: '127.0.0.1',
user: 'postgres',
password: 'password',
database: 'facedb',
},
});

// Please create the following postgres tables:
CREATE TABLE users (
id serial PRIMARY KEY,
name VARCHAR(100),
email text UNIQUE NOT NULL,
entries BIGINT DEFAULT 0,
joined TIMESTAMP NOT NULL
)

CREATE TABLE login (
id serial PRIMARY KEY,
hash VARCHAR(100) NOT NULL,
email text UNIQUE NOT NULL
)

// sample query:
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
