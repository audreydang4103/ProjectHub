import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/PostPage.css';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  // Fetch the post data from Supabase
  const fetchPost = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching post:', error);
    } else {
      setPost(data);
    }
    setIsLoading(false);
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
  };

  // Handle upvoting the post
  const handleUpvote = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error upvoting post:', error);
      } else {
        setPost(data);
      }
    } catch (err) {
      console.error('Unexpected error during upvote:', err);
    }
  };

  // Handle adding a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('comments').insert([
        {
          post_id: id,
          content: commentContent,
        },
      ]);

      if (error) {
        console.error('Error adding comment:', error);
      } else {
        setCommentContent(''); // Clear input
        fetchComments(); // Refresh comments
      }
    } catch (err) {
      console.error('Unexpected error adding comment:', err);
    }
  };

  // Handle deleting the post
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      console.log('Attempting to delete comments for post with id:', id);
      const { error: commentError } = await supabase.from('comments').delete().eq('post_id', id);

      if (commentError) {
        console.error('Error deleting comments:', commentError);
        return;
      }

      console.log('Comments deleted successfully, now attempting to delete post with id:', id);
      const { error: postError } = await supabase.from('posts').delete().eq('id', id);

      if (postError) {
        console.error('Error deleting post:', postError);
      } else {
        console.log('Post deleted successfully');
        navigate('/'); // Navigate back to the homepage
      }
    } catch (err) {
      console.error('Unexpected error deleting post:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (

    <div className="post-page">
      <div className="navbar">
        <Link to="/">Home</Link>
      </div>
      <h1></h1>

      <div className="post-header">
        <h2>{post.title}</h2>
        <p></p>
        <div className="post-actions">
          <Link to={`/edit/${id}`}>
            <button className="action-button">✏️</button>
          </Link>
          <button onClick={handleDelete} className="action-button">🗑️</button>
        </div>
      </div>
      <p className="post-time">{new Date(post.created_at).toLocaleString()}</p>
      {post.image_url && (
        <div>
          <img src={post.image_url} alt={post.title} style={{ maxWidth: '100%' }} />
        </div>
      )}

      <div className="content-container">
        <p>{post.content}</p>
      </div>

      <div className="post-footer">
        <button onClick={handleUpvote} className="upvote-button">
          ⬆️ {post.upvotes}
        </button>
      </div>

      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          required
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Write a comment..."
        ></textarea>
        <button type="submit">Add Comment</button>
      </form>

      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <p>{comment.content}</p>
            <p className="comment-time">{new Date(comment.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostPage;