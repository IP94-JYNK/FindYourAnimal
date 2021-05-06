const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const pgclient = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'usertest',
    password: 'password',
    database: 'findyouranimal'
});

pgclient.connect();

fs.readFile(path.join(__dirname, 'db/structure.sql'), 'utf8', (err, data) => {
  if (err) throw err;
  pgclient.query(data, (err, res) => {
    if (err) throw err
    process.exit(0);
  });
});
