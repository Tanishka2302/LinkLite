// src/components/posts/CommentCard.js

import React from 'react';

const CommentCard = ({ comment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="pt-4">
      <div className="flex items-start space-x-3">
        {/* You can add avatars here later */}
        <div>
          <p className="font-semibold text-sm">{comment.author_name}</p>
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-400 mt-1">{formatDate(comment.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;