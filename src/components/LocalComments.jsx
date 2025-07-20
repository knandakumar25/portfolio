import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'portfolio_comments';

function loadComments() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveComments(comments) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comments));
}

export default function LocalComments() {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setComments(loadComments());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const newComment = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(updated);
    setName('');
    setMessage('');
  }

  function handleDelete(id) {
    const updated = comments.filter(c => c.id !== id);
    setComments(updated);
    saveComments(updated);
  }

  return (
    <div className="local-comments">
      <h3>Comments (local only)</h3>
      <form onSubmit={handleSubmit} style={{marginBottom: 16}}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{marginRight: 8}}
        />
        <input
          type="text"
          placeholder="Your comment"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          style={{marginRight: 8, width: 200}}
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{listStyle: 'none', padding: 0}}>
        {comments.map(c => (
          <li key={c.id} style={{marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 8}}>
            <strong>{c.name}</strong> <span style={{color: '#888', fontSize: 12}}>{new Date(c.timestamp).toLocaleString()}</span>
            <p style={{margin: '4px 0'}}>{c.message}</p>
            <button onClick={() => handleDelete(c.id)} style={{fontSize: 12}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
