import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/EditPost.css';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
        if (error) {
            console.error(error);
        } else {
            setTitle(data.title);
            setContent(data.content);
            setImageUrl(data.image_url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('posts')
            .update({
                title,
                content,
                image_url: imageUrl,
            })
            .eq('id', id);

        if (error) {
            console.error(error);
        } else {
            navigate(`/post/${id}`);
        }
    };

    return (
        <div>
            <div className="navbar">
                <Link to="/">Home</Link>
                <Link to={`/post/${id}`}>Back to Post</Link>
            </div>

            <h2>Edit Post</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>

                <label>
                    Content:
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                </label>

                <label>
                    Image URL:
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </label>

                <button type="submit">Update Post</button>
            </form>
        </div>
    );
}

export default EditPost;
