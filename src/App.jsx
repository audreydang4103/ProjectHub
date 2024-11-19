import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeFeed from './components/HomeFeed';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </div>
  );
}

export default App;
