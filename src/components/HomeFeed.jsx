import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/HomeFeed.css';

function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [sortOrder, searchQuery]);

  const fetchPosts = async () => {
    let query = supabase.from('posts').select('*');

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    if (sortOrder === 'upvotes') {
      query = query.order('upvotes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      setPosts(data);
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/create">Create a New Post</Link>
      </div>
      <h1></h1>
      <h1 className="text-center">Welcome to the Forum</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="created_at">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>
              <h3>{post.title}</h3>
              <p className="post-meta">Upvotes: {post.upvotes}</p>
              <p className="post-meta">
                Created at: {new Date(post.created_at).toLocaleString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeFeed;
