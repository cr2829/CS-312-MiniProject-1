require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Signup page
app.get('/signup', (req, res) => {
  res.render('signup', { user: req.session, error: null });
});

app.post('/signup', async (req, res) => {
  const { user_id, password, name } = req.body;

  try {
    console.log('Signup form submitted:', req.body); // ✅ Debug log

    // Check if user_id already exists
    const existing = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

    if (existing.rows.length > 0) {
      return res.render('signup', {
        user: req.session,
        error: 'User ID already taken. Please choose another.'
      });
    }

    // Insert new user
    await pool.query(
      'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)',
      [user_id, password, name]
    );

    // Redirect to signin page
    res.redirect('/signin');
  } catch (err) {
    console.error('Signup error:', err);
    res.render('signup', {
      user: req.session,
      error: 'Something went wrong. Please try again.'
    });
  }
});


// Signin page
app.get('/signin', (req, res) => {
  res.render('signin', { user: req.session, error: null });
});

app.post('/signin', async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1 AND password = $2', [user_id, password]);
    if (result.rows.length === 0) {
      return res.render('signin', {
        user: req.session,
        error: 'Invalid credentials. Please try again.'
      });
    }
    req.session.user_id = user_id;
    req.session.name = result.rows[0].name;
    res.redirect('/');
  } catch (err) {
    console.error('Signin error:', err);
    res.render('signin', {
      user: req.session,
      error: 'Something went wrong. Please try again.'
    });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/signin');
  });
});

// Home page - list posts
app.get('/', async (req, res) => {
  // Optional: restrict homepage to signed-in users
  // if (!req.session.user_id) return res.redirect('/signin');

  const posts = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
  res.render('index', { posts: posts.rows, user: req.session });
});

// New post form
app.get('/new', (req, res) => {
  if (!req.session.user_id) return res.redirect('/signin');
  res.render('new', { user: req.session });
});

app.post('/new', async (req, res) => {
  const { title, body } = req.body;
  await pool.query(
    'INSERT INTO blogs (creator_name, creator_user_id, title, body) VALUES ($1, $2, $3, $4)',
    [req.session.name, req.session.user_id, title, body]
  );
  res.redirect('/');
});

// Edit post form
app.get('/posts/:id/edit', async (req, res) => {
  const { id } = req.params;
  const post = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [id]);
  if (post.rows.length === 0) return res.status(404).send('Post not found');
  if (post.rows[0].creator_user_id !== req.session.user_id) return res.status(403).send('Unauthorized');
  res.render('edit', { post: post.rows[0], user: req.session });
});

// Handle edit submission
app.post('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const post = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [id]);
  if (post.rows.length === 0) return res.status(404).send('Post not found');
  if (post.rows[0].creator_user_id !== req.session.user_id) return res.status(403).send('Unauthorized');
  await pool.query('UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3', [title, body, id]);
  res.redirect('/');
});

// Handle delete
app.post('/posts/:id/delete', async (req, res) => {
  const { id } = req.params;
  const post = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [id]);
  if (post.rows.length === 0) return res.status(404).send('Post not found');
  if (post.rows[0].creator_user_id !== req.session.user_id) return res.status(403).send('Unauthorized');
  await pool.query('DELETE FROM blogs WHERE blog_id = $1', [id]);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
