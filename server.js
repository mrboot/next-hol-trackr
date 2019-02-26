/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const db = require('diskdb');
const bodyParser = require('body-parser');

db.connect('./db', ['holidays', 'categories']);

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  // HOLIDAYS
  // CREATE
  server.post('/db/holidays', async (req, res) => {
    console.log(req.body);
    const holiday = db.holidays.save(req.body);
    console.log(holiday);
    res.json(holiday);
  });

  // READ
  server.get('/db/holidays', async (req, res) => {
    const holidays = db.holidays.find();
    res.json(holidays);
  });

  // DELETE
  server.delete('/db/holiday/:id', async (req, res) => {
    db.holidays.remove({ _id: req.params.id });
    res.json({ status: 'success' });
  });

  // CATEGORIES
  // READ
  server.get('/db/categories', async (req, res) => {
    const categories = db.categories.find();
    res.json(categories);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
