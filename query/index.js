const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const posts = {};

const handlEvent = ({ type, payload }) => {
  if (type === 'PostCreated') {
    const { id, title } = payload;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, status, postId } = payload;
    posts[postId].comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, status, postId } = payload;
    const { comments } = posts[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  handlEvent(req.body);
  res.send({ status: 'OK' });
});

app.listen(4002, async () => {
  console.log('Listening on port 4002');

  try {
    const res = await axios.get('http://localhost:4005/events');
    for (let event of res.data) {
      console.log('Processing ', event.type);
      handlEvent(event);
    }
  } catch (error) {
    console.log(error);
  }
});
