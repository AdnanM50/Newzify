import React from 'react';
import { useFetch } from '../../helpers/hooks';
import { getCommentsByNewsId } from '../../helpers/backend';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  newsId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ newsId }) => {
  const { data: comments, isLoading, refetch } = useFetch(['comments', newsId], getCommentsByNewsId, {
    newsId
  });

  return (
    <section className="mt-16 border-t border-gray-100 pt-10">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-6 w-6 text-red-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Comments ({comments?.length || 0})
        </h3>
      </div>

      <div className="mb-10">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h4>
        <CommentForm newsId={newsId} onSuccess={() => refetch()} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment: any) => (
              <CommentItem key={comment._id} comment={comment} newsId={newsId} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
