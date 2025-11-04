const blogs = [
  {
    blog_id: 'blog_1',
    title: 'Welcome to the Blog',
    body: 'This is the first post.',
    creator_user_id: 'user123',
    creator_name: 'Alice',
    date_created: new Date().toISOString(),
    date_updated: new Date().toISOString()
  }
];

module.exports = { blogs };
