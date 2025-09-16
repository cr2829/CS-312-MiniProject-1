const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Temporary in-memory posts array
let posts = [];

// Routes
// Home page - list posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// New post form
app.get('/new', (req, res) => {
  res.render('new');
});

// Handle new post submission
app.post('/new', (req, res) => {
  const { author, title, content } = req.body;
  posts.push({ author, title, content, createdAt: new Date() });
  res.redirect('/');
});

// Edit post form
app.get('/posts/:id/edit', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts[id];
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('edit', { post, id });
});

// Handle edit submission
app.post('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!posts[id]) {
    return res.status(404).send('Post not found');
  }
  const { author, title, content } = req.body;
  posts[id] = {
    ...posts[id],
    author,
    title,
    content
  };
  res.redirect('/');
});

// Handle delete
app.post('/posts/:id/delete', (req, res) => {
  const id = parseInt(req.params.id);
  if (!posts[id]) {
    return res.status(404).send('Post not found');
  }
  posts.splice(id, 1);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
