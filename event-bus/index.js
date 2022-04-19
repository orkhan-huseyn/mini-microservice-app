const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const subscribers = [
  'http://localhost:4000/events',
  'http://localhost:4001/events',
  'http://localhost:4002/events',
  'http://localhost:4003/events',
];

const events = [];

app.post('/events', async (req, res) => {
  const event = req.body;
  events.push(event);
  const requests = subscribers.map((url) => axios.post(url, event));
  await Promise.allSettled(requests);
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
