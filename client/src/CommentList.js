import React from 'react';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    return (
      <li key={comment.id}>
        {comment.content}{' '}
        {comment.status === 'pending' && (
          <span className="badge bg-secondary">pending</span>
        )}
        {comment.status === 'approved' && (
          <span className="badge bg-success">approved</span>
        )}
        {comment.status === 'rejected' && (
          <span className="badge bg-danger">rejected</span>
        )}
      </li>
    );
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
