import React, { useEffect, useState } from 'react';
import APIRequests from '../../services/APIRequests.jsx';
import { useUser } from '../../services/UserProvider.jsx';
import styles from './Comments.module.css';

const Comments = ({ songId }) => {
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', body: '' });
  const [newCommentFields, setNewCommentFields] = useState({ title: '', body: '' });
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [error, setError] = useState(null)
  const { user } = useUser();

  useEffect(() => {
    fetchComments();
  }, [songId]);

  const fetchComments = async () => {
    try {
      const res = await APIRequests.getRequest(`comments/song/${songId}`);
      setComments(res);
    } catch (err) {
      setError(err.message || "Error updating comment");

    }
  };

  const handleDelete = async (id) => {
    try {
      await APIRequests.deleteRequest(`comments/${id}`);
      fetchComments();
    } catch (err) {
      setError(err.message || "Error updating comment");
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditFields({ title: comment.title, body: comment.body });
  };

  const handleUpdate = async (id) => {
    try {
      await APIRequests.patchRequest(`comments/${id}`, editFields);
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      setError(err.message || "Error updating comment");
    }
  };

  const handleAddComment = async () => {
    if (!newCommentFields.title || !newCommentFields.body) return;

    const newComment = {
      title: newCommentFields.title,
      body: newCommentFields.body,
      song_id: songId,
    };

    try {
      await APIRequests.postRequest('comments', newComment);
      setNewCommentFields({ title: '', body: '' });
      setIsAddingComment(false);
      fetchComments();
    } catch (err) {
      setError(err.message || "Error updating comment");
    }
  };

  return (
    <div className={styles.commentsContainer}>

      <h2>Comments</h2>
      {error && (
        <div className={styles.errorMsg}>{error}</div>
      )}
      {!isAddingComment ? (
        <button className={styles.newCommentBtn} onClick={() => setIsAddingComment(true)}>
          ➕ New Comment
        </button>
      ) : (
        <div className={styles.newCommentForm}>
          <input
            type="text"
            value={newCommentFields.title}
            onChange={(e) => setNewCommentFields({ ...newCommentFields, title: e.target.value })}
            placeholder="Title"
          />
          <textarea
            value={newCommentFields.body}
            onChange={(e) => setNewCommentFields({ ...newCommentFields, body: e.target.value })}
            placeholder="Body"
          />
          <button onClick={handleAddComment}>Submit Comment</button>
        </div>
      )}

      {comments.map((c) => (
        <div key={c.id} className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <strong>{c.username}</strong> ({c.email})
          </div>
          {editingCommentId === c.id ? (
            <div className={styles.commentEditForm}>
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
              <button onClick={() => handleUpdate(c.id)}>Save</button>
              <button onClick={() => setEditingCommentId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
              {user?.id === c.user_id && (
                <div className={styles.commentActions}>
                  <button onClick={() => handleEdit(c)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
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

