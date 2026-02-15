import React, { useState } from 'react';
import { ThumbsUp,Trash2, Reply } from 'lucide-react';
import { Button } from '../ui/button';
import { useAction } from '../../helpers/hooks';
import { toggleLikeComment, deleteComment } from '../../helpers/backend';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: any;
  newsId: string;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, newsId, isReply = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  
  const { mutate: toggleLike } = useAction(toggleLikeComment, {
    invalidateKeys: ['comments']
  });

  const { mutate: removeComment } = useAction(deleteComment, {
    invalidateKeys: ['comments']
  });

  const handleLike = () => {
    toggleLike({ id: comment._id });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      removeComment({ id: comment._id });
    }
  };

  return (
    <div className={`flex gap-4 ${isReply ? 'ml-12 mt-4' : 'mt-8'}`}>
      <div className="flex-shrink-0">
        <img 
          src={comment.userId?.image || 'https://via.placeholder.com/40'} 
          alt={comment.userId?.first_name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <div className="bg-gray-50 p-4 rounded-2xl relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-gray-900">
                {comment.userId?.first_name} {comment.userId?.last_name}
              </h4>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-1">
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 mt-2 ml-2">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm font-medium ${
              comment.likes?.length > 0 ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{comment.likes?.length || 0}</span>
          </button>
          
          {!isReply && (
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-sm text-gray-500 font-medium hover:text-red-600"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4 ml-2">
            <CommentForm 
              newsId={newsId} 
              parentCommentId={comment._id} 
              onSuccess={() => setIsReplying(false)}
              onCancel={() => setIsReplying(false)}
              placeholder={`Reply to ${comment.userId?.first_name}...`}
              buttonText="Reply"
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply: any) => (
              <CommentItem 
                key={reply._id} 
                comment={reply} 
                newsId={newsId} 
                isReply={true} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
