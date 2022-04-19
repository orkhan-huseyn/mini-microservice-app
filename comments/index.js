const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const commentsByPostId = {};

app.get('/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const comments = commentsByPostId[postId] || [];
  res.send(comments);
});

app.post('/posts/:postId/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { postId } = req.params;
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  const comment = { id: commentId, content, status: 'pending' };
  comments.push(comment);
  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    payload: {
      postId,
      ...comment,
    },
  });

  res.status(201).send(comment);
});

app.post('/events', async (req, res) => {
  const { type, payload } = req.body;
  if (type === 'CommentModerated') {
    const { postId, id, status } = payload;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      payload: {
        postId,
        ...comment,
      },
    });
  }
  res.send({ status: 'OK' });
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
