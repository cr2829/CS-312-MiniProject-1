import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [user_id, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error on submit

    try {
      const res = await axios.post(
        'http://localhost:3000/api/signup',
        { user_id, password, name },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Store user info in localStorage
        localStorage.setItem('user_id', res.data.user.user_id);
        localStorage.setItem('name', res.data.user.name);

        // Redirect to posts page
        navigate('/posts');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="User ID"
            className="form-control"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>

      {error && <p className="text-danger mt-3">{error}</p>}

      <p className="mt-3">
        Already have an account? <a href="/signin">Sign in here</a>.
      </p>
    </div>
  );
};

export default Signup;
