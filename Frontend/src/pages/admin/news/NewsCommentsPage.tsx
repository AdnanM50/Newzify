import { useParams } from "@tanstack/react-router";
import { useFetch } from "../../../helpers/hooks";
import { getCommentsByNewsId, getNewsById, type TNews } from "../../../helpers/backend";
import CommentItem from "../../../components/comments/CommentItem";
import { Loader2, MessageSquare } from "lucide-react";

const NewsCommentsPage = () => {
  const { newsId } = useParams({ from: '/admin/news/$newsId/comments' });
  
  const { data: news, isLoading: isNewsLoading } = useFetch<TNews>(
    ["news", newsId],
    getNewsById,
    { id: newsId }
  );

  const { data: comments, isLoading: isCommentsLoading } = useFetch<any[]>(
    ["comments", newsId],
    getCommentsByNewsId,
    { newsId }
  );

  if (isNewsLoading || isCommentsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="text-blue-600" />
          Comments for "{news?.title}"
        </h1>
        <p className="text-gray-500 mt-1">Manage all comments and replies for this article.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem 
                key={comment._id} 
                comment={comment} 
                newsId={newsId} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No comments yet for this article.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCommentsPage;
