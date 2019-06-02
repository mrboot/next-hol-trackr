/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const next = require('next');
const db = require('diskdb');
const bodyParser = require('body-parser');

db.connect('./db', ['holidays', 'categories', 'entitlements']);

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.use(cors());

  // HOLIDAYS
  // CREATE
  server.post('/db/holidays', async (req, res) => {
    const holiday = db.holidays.save(req.body);
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
  // CREATE
  server.post('/db/categories', async (req, res) => {
    const category = db.categories.save(req.body);
    res.json(category);
  });

  // READ
  server.get('/db/categories', async (req, res) => {
    const categories = db.categories.find();
    res.json(categories);
  });

  // DELETE
  server.delete('/db/category/:id', async (req, res) => {
    db.categories.remove({ _id: req.params.id });
    res.json({ status: 'success' });
  });

  // ENTITLEMENTS
  // CREATE
  server.post('/db/entitlements', async (req, res) => {
    const entitlement = db.entitlements.save(req.body);
    res.json(entitlement);
  });

  // READ ALL
  server.get('/db/entitlements', async (req, res) => {
    const entitlements = db.entitlements.find();
    res.json(entitlements);
  });

  // READ ONE
  server.get('/db/entitlement/:year', async (req, res) => {
    const { year } = req.params;
    const entitlement = db.entitlements.findOne({ year });
    if (entitlement) {
      res.json(entitlement);
    } else {
      const newYear = { year, base: 200, carried: 0 };
      const addedEntitlement = db.entitlements.save(newYear);
      res.json(addedEntitlement);
    }
  });

  // UPDATE
  server.put('/db/entitlement/:year', (req, res) => {
    const { year } = req.params;
    const entitlement = req.body;
    console.log('Editing entitlement for year: ', year, ' to be ', entitlement);

    db.entitlements.update({ year }, entitlement);

    res.json(db.entitlements.findOne({ year }));
  });

  // DELETE
  server.delete('/db/entitlement/:id', async (req, res) => {
    db.categories.remove({ _id: req.params.id });
    res.json({ status: 'success' });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
