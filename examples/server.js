'use strict';

const express = require('express');

const app = new express();
const port = 3000;

app.route('/api')
  .get((req, res) => {
    res.json({ message: 'GET Request to /api' });
  })
  .post((req, res) => {
    res.json({ message: 'POST Request to /api' });
  })
  .put((req, res) => {
    res.json({ message: 'PUT Request to /api' });
  })
  .delete((req, res) => {
    res.json({ message: 'DELETE Request to /api' });
  });

app.route('/api/v1/hello')
  .get((req, res) => {
    res.json({ message: 'GET Request to /api/v1/hello' });
  })
  .post((req, res) => {
    res.json({ message: 'POST Request to /api/v1/hello' });
  })
  .put((req, res) => {
    res.json({ message: 'PUT Request to /api/v1/hello' });
  })
  .delete((req, res) => {
    res.json({ message: 'DELETE Request to /api/v1/hello' });
  });

app.route('/api/v1/hello/:id')
  .get((req, res) => {
    res.json({ message: `GET Request to /api/v1/hello/${req.params.id}` });
  })
  .post((req, res) => {
    res.json({ message: `POST Request to /api/v1/hello/${req.params.id}` });
  })
  .put((req, res) => {
    res.json({ message: `PUT Request to /api/v1/hello/${req.params.id}` });
  })
  .delete((req, res) => {
    res.json({ message: `DELETE Request to /api/v1/hello/${req.params.id}` });
  });

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Listening on port ${port}`);
  }
});
