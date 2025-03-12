function CommentSection({ productId }) {
  try {
    const [comments, setComments] = React.useState([]);
    const [commentText, setCommentText] = React.useState('');
    const [replyText, setReplyText] = React.useState({});
    const [replyingTo, setReplyingTo] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const currentUser = getCurrentUser();
    
    // Load comments
    React.useEffect(() => {
      try {
        const loadedComments = getComments(productId);
        setComments(loadedComments);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError('Failed to load comments');
        setIsLoading(false);
      }
    }, [productId]);
    
    const handleCommentSubmit = (e) => {
      e.preventDefault();
      
      if (!currentUser) {
        setError('You must be logged in to comment');
        return;
      }
      
      if (!commentText.trim()) {
        setError('Comment cannot be empty');
        return;
      }
      
      try {
        const result = addComment(productId, commentText, currentUser);
        
        if (result.success) {
          setComments([...comments, result.comment]);
          setCommentText('');
          setError('');
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error adding comment:', err);
        setError('Failed to add comment');
      }
    };
    
    const handleReplySubmit = (commentId) => {
      if (!currentUser) {
        setError('You must be logged in to reply');
        return;
      }
      
      const reply = replyText[commentId];
      
      if (!reply || !reply.trim()) {
        setError('Reply cannot be empty');
        return;
      }
      
      try {
        const result = addReply(productId, commentId, reply, currentUser);
        
        if (result.success) {
          // Update comments with the new reply
          const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, result.reply]
              };
            }
            return comment;
          });
          
          setComments(updatedComments);
          setReplyText({...replyText, [commentId]: ''});
          setReplyingTo(null);
          setError('');
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error adding reply:', err);
        setError('Failed to add reply');
      }
    };
    
    const toggleReplyForm = (commentId) => {
      if (replyingTo === commentId) {
        setReplyingTo(null);
      } else {
        setReplyingTo(commentId);
        // Initialize reply text if not exists
        if (!replyText[commentId]) {
          setReplyText({...replyText, [commentId]: ''});
        }
      }
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };
    
    if (isLoading) {
      return (
        <div className="comments-section" data-name="comments-section">
          <h2 className="comments-title" data-name="comments-title">Comments</h2>
          <div className="flex justify-center py-4" data-name="comments-loading">
            <div className="spinner"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="comments-section" data-name="comments-section">
        <h2 className="comments-title" data-name="comments-title">Comments</h2>
        
        {error && (
          <div className="auth-error mb-4" data-name="comments-error">{error}</div>
        )}
        
        <form onSubmit={handleCommentSubmit} className="comment-form" data-name="comment-form">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="comment-input"
            placeholder={currentUser ? "Write a comment..." : "Login to comment"}
            disabled={!currentUser}
            data-name="comment-input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!currentUser}
            data-name="comment-submit"
          >
            Post
          </button>
        </form>
        
        {comments.length === 0 ? (
          <div className="text-center py-4 opacity-70" data-name="no-comments">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="comment-list" data-name="comment-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item" data-name="comment-item">
                <div className="comment-header" data-name="comment-header">
                  <img
                    src={comment.avatar}
                    alt={comment.username}
                    className="comment-avatar"
                    data-name="comment-avatar"
                  />
                  <div>
                    <div className="comment-author" data-name="comment-author">{comment.username}</div>
                    <div className="comment-date" data-name="comment-date">{formatDate(comment.createdAt)}</div>
                  </div>
                </div>
                
                <div className="comment-content" data-name="comment-content">{comment.text}</div>
                
                <div className="comment-actions" data-name="comment-actions">
                  {currentUser && (
                    <button 
                      onClick={() => toggleReplyForm(comment.id)}
                      className="comment-action"
                      data-name="reply-button"
                    >
                      <i className="fas fa-reply"></i> Reply
                    </button>
                  )}
                </div>
                
                {replyingTo === comment.id && (
                  <div className="reply-form" data-name="reply-form">
                    <input
                      type="text"
                      value={replyText[comment.id] || ''}
                      onChange={(e) => setReplyText({...replyText, [comment.id]: e.target.value})}
                      className="reply-input"
                      placeholder="Write a reply..."
                      data-name="reply-input"
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="btn btn-primary"
                      data-name="reply-submit"
                    >
                      Reply
                    </button>
                  </div>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="reply-list" data-name="reply-list">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="reply-item" data-name="reply-item">
                        <div className="reply-header" data-name="reply-header">
                          <img
                            src={reply.avatar}
                            alt={reply.username}
                            className="reply-avatar"
                            data-name="reply-avatar"
                          />
                          <div>
                            <div className="reply-author" data-name="reply-author">{reply.username}</div>
                            <div className="reply-date" data-name="reply-date">{formatDate(reply.createdAt)}</div>
                          </div>
                        </div>
                        
                        <div className="reply-content" data-name="reply-content">{reply.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('CommentSection error:', error);
    reportError(error);
    return null;
  }
}
