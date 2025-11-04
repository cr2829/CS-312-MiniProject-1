const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { blogs } = require('../data'); // Make sure this exports your blog array

// GET /api/blogs - Fetch all posts
router.get('/blogs', authenticate, (req, res) => {
  res.status(200).json(blogs);
});

// GET /api/blogs/:id - Fetch a single post
router.get('/blogs/:id', authenticate, (req, res) => {
  const blogId = req.params.id;
  const post = blogs.find(post => post.blog_id === blogId);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.status(200).json(post);
});

// POST /api/blogs - Create a new post
router.post('/blogs', authenticate, (req, res) => {
  const { title, body } = req.body;
  const user = req.user;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  const newPost = {
    blog_id: `blog_${Date.now()}`,
    title,
    body,
    creator_user_id: user.user_id,
    creator_name: user.name,
    date_created: new Date().toISOString(),
    date_updated: new Date().toISOString()
  };

  blogs.push(newPost);
  res.status(201).json({ message: 'Post created successfully', post: newPost });
});

// PUT /api/blogs/:id - Update a post
router.put('/blogs/:id', authenticate, (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.user_id;
  const { title, body } = req.body;

  const postIndex = blogs.findIndex(post => post.blog_id === blogId);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const post = blogs[postIndex];
  if (post.creator_user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized to edit this post' });
  }

  post.title = title;
  post.body = body;
  post.date_updated = new Date().toISOString();

  res.status(200).json({ message: 'Post updated successfully', post });
});

// DELETE /api/blogs/:id - Delete a post
router.delete('/blogs/:id', authenticate, (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.user_id;

  const postIndex = blogs.findIndex(post => post.blog_id === blogId);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const post = blogs[postIndex];
  if (post.creator_user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized to delete this post' });
  }

  blogs.splice(postIndex, 1);
  res.status(200).json({ message: 'Post deleted successfully' });
});

module.exports = router;
