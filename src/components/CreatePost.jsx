import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/CreatePost.css';

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from('posts').insert([
        {
          title,
          content,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        console.error('Error creating post:', error);
        alert('Error creating post. Please try again.');
        return;
      }

      console.log('Post created:', data);

      // Redirect to home page or clear form
      navigate('/');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </label>
        <label>
          Image URL:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;