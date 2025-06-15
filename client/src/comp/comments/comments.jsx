import React, { useEffect, useState } from 'react';
import APIRequests from '../../services/APIRequests.jsx';
import './Comments.css';

const Comments = ({ songId }) => {
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', body: '' });
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComments();
  }, [songId]);

  const fetchComments = async () => {
    try {
      const res = await APIRequests.getRequest(`comments/song/${songId}`);

      setComments(res);

    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await APIRequests.deleteRequest(`comments/${id}`, token);
      fetchComments();
    } catch (err) {
      alert("Unauthorized or error deleting comment.");
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditFields({ title: comment.title, body: comment.body });
  };

  const handleUpdate = async (id) => {
    try {
      await APIRequests.patchRequest(`comments/${id}`, editFields, token);
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      alert("Update failed. You might not have permission.");
    }
  };

  return (
    <div className="comments-container">
      <h2>תגובות</h2>
      {comments.map((c) => (
        <div key={c.id} className="comment-card">
          <div className="comment-header">
            <strong>{c.username}</strong> ({c.email})
          </div>
          {editingCommentId === c.id ? (
            <div className="comment-edit-form">
              <input
                type="text"
                value={editFields.title}
                onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                placeholder="Title"
              />
              <textarea
                value={editFields.body}
                onChange={(e) => setEditFields({ ...editFields, body: e.target.value })}
                placeholder="Body"
              />
              <button onClick={() => handleUpdate(c.id)}>שמירה</button>
              <button onClick={() => setEditingCommentId(null)}>ביטול</button>
            </div>
          ) : (
            <>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
              {currentUser?.id === c.user_id && (
                <div className="comment-actions">
                  <button onClick={() => handleEdit(c)}>✏️ ערוך</button>
                  <button onClick={() => handleDelete(c.id)}>🗑️ מחק</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
