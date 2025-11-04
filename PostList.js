// src/components/PostList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('user_id');

  // Fetch all posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/blogs', {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete a post
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/blogs/${id}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.blog_id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  // Navigate to edit form
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Blog Posts</h2>
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-success mb-3" onClick={() => navigate('/new')}>
        Create New Post
      </button>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.blog_id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.body}</p>
              <p className="text-muted">
                By {post.creator_name} |{' '}
                {new Date(post.date_created).toLocaleString()}
              </p>

              {post.creator_user_id === currentUserId && (
                <div>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(post.blog_id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(post.blog_id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
